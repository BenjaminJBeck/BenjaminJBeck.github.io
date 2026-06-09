const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs').promises;
const fssync = require('fs');              // for existsSync in the helper
const path = require('path');
const crypto = require('crypto');          // NEW: for stable hashed filenames

// Get the user data directory for storing files
const userDataPath = app.getPath('userData');
const notebookDataFile = path.join(userDataPath, 'notebook-data.json');
const booksDataDir = path.join(userDataPath, 'books'); // Directory for individual book files
console.log('Notebook files will be saved in:', userDataPath);

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

// Updated book data structure functions - now matches the exported format
function createInitialBookInfo(bookName) {
  return {
    pages: [
      {
        content: `
                <div class="toc-page">
                    <div class="toc-title">📚 Table of Contents</div>
            
                    <div style="text-align: center; color: #666; padding: 2rem; font-style: italic;">
                        No chapters yet. Add chapters using the "Add Chapter" button above.
                    </div>
                </div>`,
        isTOC: true,
        drawings: []
      },
      {
        content: `
    <div class="entry-title-line">${bookName}</div>
    <div class="entry-date-line">${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}</div>
    <div class="page-body"><p style="line-height: 1.6"><br></p></div>
  `,
        isTOC: false,
        drawings: []
      }
    ],
    chapters: [],
    currentPage: 0,
    globalFormatting: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: "16px",
      lineHeight: "1.6"
    },
    // Keep some metadata for backwards compatibility and file management
    metadata: {
      bookName: bookName,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: 1
    }
  };
}

function updateLastModified(bookInfo) {
  if (!bookInfo.metadata) {
    bookInfo.metadata = {
      bookName: bookInfo.bookName || 'Unknown',
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: 1
    };
  }
  
  bookInfo.metadata.lastModified = new Date().toISOString();
  bookInfo.metadata.version = (bookInfo.metadata.version || 0) + 1;
}

function generateContentHash(content) {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

// Function to migrate from old format to new format
function migrateBookInfo(oldBookInfo, bookName) {
  // Check if it's already in the new format
  if (oldBookInfo.pages && oldBookInfo.chapters !== undefined && oldBookInfo.globalFormatting) {
    // Already in new format, just ensure metadata exists
    if (!oldBookInfo.metadata) {
      oldBookInfo.metadata = {
        bookName: bookName,
        createdAt: oldBookInfo.createdAt || new Date().toISOString(),
        lastModified: oldBookInfo.lastModified || new Date().toISOString(),
        version: oldBookInfo.version || 1
      };
    }
    return oldBookInfo;
  }
  
  // Migration from old format
  const newBookInfo = createInitialBookInfo(bookName);
  
  // Preserve metadata from old format if it exists
  if (oldBookInfo.createdAt) {
    newBookInfo.metadata.createdAt = oldBookInfo.createdAt;
  }
  if (oldBookInfo.lastModified) {
    newBookInfo.metadata.lastModified = oldBookInfo.lastModified;
  }
  
  // Try to migrate content from old editor state format
  if (oldBookInfo.editorState && oldBookInfo.editorState.htmlContent) {
    // Replace the default first content page with migrated content
    newBookInfo.pages[1].content = `
    <div class="entry-title-line">${bookName}</div>
    <div class="entry-date-line">${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}</div>
    <div class="page-body">${oldBookInfo.editorState.htmlContent}</div>
  `;
  }
  
  console.log('Migrated book from old format to new format');
  return newBookInfo;
}

// Ensure books directory exists
async function ensureBooksDirectory() {
  try {
    await fs.mkdir(booksDataDir, { recursive: true });
  } catch (error) {
    console.error('Error creating books directory:', error);
  }
}

// Helper function to sanitize folder names
function sanitizeFolderName(name) {
  return name.replace(/[<>:"/\\|?*]/g, '-').trim();
}

// Ensure individual book directory exists, create media subfolder, and create book info JSON
async function ensureBookDirectory(bookName) {
  try {
    const sanitizedName = sanitizeFolderName(bookName);
    const bookDir = path.join(booksDataDir, sanitizedName);
    await fs.mkdir(bookDir, { recursive: true });
    
    // Create media subfolder inside the book directory
    const mediaDir = path.join(bookDir, 'media');
    await fs.mkdir(mediaDir, { recursive: true });
    console.log('Media directory created at:', mediaDir);
    
    // Create book info JSON file with new structure
    const bookInfoPath = path.join(bookDir, `${sanitizedName}.json`);
    
    // Check if file already exists
    try {
      await fs.access(bookInfoPath);
      console.log('Book info file already exists:', bookInfoPath);
      
      // Load existing data and migrate it to new structure
      try {
        const existingData = await fs.readFile(bookInfoPath, 'utf8');
        const oldBookInfo = JSON.parse(existingData);
        const migratedBookInfo = migrateBookInfo(oldBookInfo, bookName);
        
        // Save the migrated data back
        await fs.writeFile(bookInfoPath, JSON.stringify(migratedBookInfo, null, 2));
        console.log('Book info file migrated to new structure');
      } catch (parseError) {
        console.error('Error migrating existing book info:', parseError);
        // If migration fails, create fresh structure
        const bookInfo = createInitialBookInfo(bookName);
        await fs.writeFile(bookInfoPath, JSON.stringify(bookInfo, null, 2));
        console.log('Created fresh book info file after migration error');
      }
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, create it with new structure
        const bookInfo = createInitialBookInfo(bookName);
        await fs.writeFile(bookInfoPath, JSON.stringify(bookInfo, null, 2));
        console.log('Book info file created with new structure at:', bookInfoPath);
      }
    }
    
    return bookDir;
  } catch (error) {
    console.error('Error creating book directory, media subfolder, or book info file:', error);
    throw error;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    // REPLACED: remove width/height, add show:false so we can maximize cleanly
    show: false,
    title: 'Oldly Notebook',
    icon: path.join(__dirname, 'Book5.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('index.html');

  // ADDED: maximize once ready, then show (avoids white flash)
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  // Optional: DevTools
  // mainWindow.webContents.openDevTools();
}

// Open editor IN THE SAME WINDOW
ipcMain.handle('open-editor', async (event, bookId, bookName) => {
  if (!mainWindow) createWindow();

  const editorPath = path.join(__dirname, 'editor.html');
  await mainWindow.loadFile(editorPath, {
    query: { bookId, bookName }
  });

  mainWindow.setTitle(`${bookName} - Editor`);
  mainWindow.setMenuBarVisibility(false); // keep your current behavior
  return { success: true };
});

// Handle "Back to Desktop" functionality
ipcMain.handle('go-back-to-index', async (event) => {
  console.log('=== GO-BACK-TO-INDEX CALLED ===');
  
  try {
    if (!mainWindow) {
      console.error('Main window not found');
      return { success: false, error: 'Main window not found' };
    }

    // Load the desktop (index.html)
    await mainWindow.loadFile('index.html');
    mainWindow.setTitle('Oldly Notebook');
    
    console.log('Successfully returned to desktop');
    return { success: true };
    
  } catch (error) {
    console.error('Error in go-back-to-index:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-book-info', async (event, bookName) => {
  try {
    const sanitizedName = sanitizeFolderName(bookName);
    const bookDir = path.join(booksDataDir, sanitizedName);
    const bookInfoPath = path.join(bookDir, `${sanitizedName}.json`);

    const data = await fs.readFile(bookInfoPath, 'utf8');
    const bookInfo = JSON.parse(data);

    const migratedBookInfo = migrateBookInfo(bookInfo, bookName);

    // ✅ also send back the folder path so the renderer can show it
    return { success: true, data: migratedBookInfo, folder: bookDir };
  } catch (error) {
    if (error.code === 'ENOENT') {
      const bookInfo = createInitialBookInfo(bookName);
      return { success: true, data: bookInfo, folder: null };
    }
    console.error('Error loading book info:', error);
    return { success: false, error: error.message };
  }
});

// Write a base64 data URL (image/video) into bookFolder/media and return a relative `media/...` path
async function writeMediaOnce(bookFolder, mime, base64) {
  const mediaFolder = path.join(bookFolder, 'media');
  await fs.mkdir(mediaFolder, { recursive: true });

  const [, type, ext] = /^(\w+)\/([\w+.-]+)/.exec(mime) || [];
  const buf = Buffer.from(base64, 'base64');
  const hash = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 16);
  const filename = `${type || 'blob'}_${hash}.${ext || 'bin'}`;
  const abs = path.join(mediaFolder, filename);

  if (!fssync.existsSync(abs)) await fs.writeFile(abs, buf);
  return `media/${filename}`;
}

// Rewrite any data: URLs in an HTML string to media files; return rewritten HTML
async function stripAndExternalizeMedia(bookFolder, html) {
  if (typeof html !== 'string') return html;

  // <img src="data:..."> OR <video src="data:...">
  html = await replaceAsync(
    html,
    /(src=["'])(data:)(image|video)\/([\w+.-]+);base64,([^"']+)(["'])/g,
    async (_, pre, _data, kind, ext, b64, post) => {
      const rel = await writeMediaOnce(bookFolder, `${kind}/${ext}`, b64);
      return `${pre}${rel}${post}`;
    }
  );

  // CSS background-image: url("data:...") — used by .polaroid .photo
  html = await replaceAsync(
    html,
    /(background-image\s*:\s*url\(\s*["']?)(data:)(image)\/([\w+.-]+);base64,([^"')]+)(["']?\s*\))/g,
    async (_, pre, _data, kind, ext, b64, post) => {
      const rel = await writeMediaOnce(bookFolder, `${kind}/${ext}`, b64);
      return `${pre}${rel}${post}`;
    }
  );

  // Optional: our custom data-src on .photo
  html = await replaceAsync(
    html,
    /(data-src=["'])(data:)(image)\/([\w+.-]+);base64,([^"']+)(["'])/g,
    async (_, pre, _data, kind, ext, b64, post) => {
      const rel = await writeMediaOnce(bookFolder, `${kind}/${ext}`, b64);
      return `${pre}${rel}${post}`;
    }
  );

  return html;
}

// Small utility: async string replace using a regex
async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (...args) => { promises.push(asyncFn(...args)); return ''; });
  const data = await Promise.all(promises);
  let i = 0;
  return str.replace(regex, () => data[i++]);
}

// Save book info (now saves in the new format)
ipcMain.handle('save-book-info', async (event, bookName, bookInfo) => {
  try {
    await ensureBooksDirectory();
    const bookDir = await ensureBookDirectory(bookName);
    const sanitizedName = sanitizeFolderName(bookName);
    const bookInfoPath = path.join(bookDir, `${sanitizedName}.json`);

    // 1) Update metadata
    updateLastModified(bookInfo);

    // 2) Walk pages and externalize any embedded base64 media
    if (Array.isArray(bookInfo.pages)) {
      const newPages = [];
      for (const p of bookInfo.pages) {
        if (p && typeof p.content === 'string') {
          const rewritten = await stripAndExternalizeMedia(bookDir, p.content);
          newPages.push({ ...p, content: rewritten });
        } else {
          newPages.push(p);
        }
      }
      bookInfo.pages = newPages;
    }

    // 3) Save JSON (now referencing media/ files)
    await fs.writeFile(bookInfoPath, JSON.stringify(bookInfo, null, 2), 'utf8');
    return { success: true, folder: bookDir };
  } catch (error) {
    console.error('Error saving book info:', error);
    return { success: false, error: error.message };
  }
});

// DEPRECATED: Keep these for backwards compatibility but redirect to new functions
ipcMain.handle('save-book-content', async (event, bookId, bookName, content) => {
  console.warn('save-book-content is deprecated, use save-book-info instead');
  try {
    // Convert old content format to new structure
    const bookInfo = createInitialBookInfo(bookName);
    
    if (typeof content === 'string') {
      // Put the content in the first non-TOC page
      bookInfo.pages[1].content = `
    <div class="entry-title-line">${bookName}</div>
    <div class="entry-date-line">${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}</div>
    <div class="page-body">${content}</div>
  `;
    }
    
    // Call the save-book-info handler logic directly
    await ensureBooksDirectory();
    const bookDir = await ensureBookDirectory(bookName);
    const sanitizedName = sanitizeFolderName(bookName);
    const bookInfoPath = path.join(bookDir, `${sanitizedName}.json`);

    updateLastModified(bookInfo);

    if (Array.isArray(bookInfo.pages)) {
      const newPages = [];
      for (const p of bookInfo.pages) {
        if (p && typeof p.content === 'string') {
          const rewritten = await stripAndExternalizeMedia(bookDir, p.content);
          newPages.push({ ...p, content: rewritten });
        } else {
          newPages.push(p);
        }
      }
      bookInfo.pages = newPages;
    }

    await fs.writeFile(bookInfoPath, JSON.stringify(bookInfo, null, 2), 'utf8');
    return { success: true, folder: bookDir };
  } catch (error) {
    console.error('Error in deprecated save-book-content:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-book-content', async (event, bookId, bookName) => {
  console.warn('load-book-content is deprecated, use load-book-info instead');
  try {
    // Call the load-book-info handler logic directly
    const sanitizedName = sanitizeFolderName(bookName);
    const bookDir = path.join(booksDataDir, sanitizedName);
    const bookInfoPath = path.join(bookDir, `${sanitizedName}.json`);

    let result;
    try {
      const data = await fs.readFile(bookInfoPath, 'utf8');
      const bookInfo = JSON.parse(data);
      const migratedBookInfo = migrateBookInfo(bookInfo, bookName);
      result = { success: true, data: migratedBookInfo, folder: bookDir };
    } catch (error) {
      if (error.code === 'ENOENT') {
        const bookInfo = createInitialBookInfo(bookName);
        result = { success: true, data: bookInfo, folder: null };
      } else {
        console.error('Error loading book info:', error);
        result = { success: false, error: error.message };
      }
    }
    
    if (result.success && result.data && result.data.pages) {
      // Find the first non-TOC page and extract content from page-body
      const contentPage = result.data.pages.find(page => !page.isTOC);
      if (contentPage && contentPage.content) {
        // Try to extract content from page-body div
        const match = contentPage.content.match(/<div class="page-body">(.*?)<\/div>/s);
        const content = match ? match[1] : contentPage.content;
        return { success: true, data: content };
      }
    }
    return { success: true, data: null };
  } catch (error) {
    console.error('Error in deprecated load-book-content:', error);
    return { success: false, error: error.message };
  }
});

// Handle save request from renderer (for the main notebook data)
ipcMain.handle('save-notebook-data', async (event, data) => {
  try {
    await fs.writeFile(notebookDataFile, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving notebook data:', error);
    return { success: false, error: error.message };
  }
});

// Handle load request from renderer (for the main notebook data)
ipcMain.handle('load-notebook-data', async () => {
  try {
    const data = await fs.readFile(notebookDataFile, 'utf8');
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { success: true, data: null };
    }
    console.error('Error loading notebook data:', error);
    return { success: false, error: error.message };
  }
});

app.whenReady().then(() => {
  ensureBooksDirectory();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Create book folder immediately when book is created
ipcMain.handle('create-book-folder', async (event, bookName) => {
  console.log('=== CREATE-BOOK-FOLDER CALLED ===');
  console.log('bookName:', bookName);
  
  try {
    await ensureBooksDirectory();
    console.log('Books directory ensured');
    
    const bookDir = await ensureBookDirectory(bookName);
    console.log('Book directory created at:', bookDir);
    
    return { success: true, folderPath: bookDir };
  } catch (error) {
    console.error('Error creating book folder:', error);
    return { success: false, error: error.message };
  }
});

// Delete book folder when book is deleted
ipcMain.handle('delete-book-folder', async (event, bookName) => {
  console.log('=== DELETE-BOOK-FOLDER CALLED ===');
  console.log('bookName:', bookName);
  
  try {
    const sanitizedName = sanitizeFolderName(bookName);
    const bookDir = path.join(booksDataDir, sanitizedName);
    
    console.log('Attempting to delete folder:', bookDir);
    
    try {
      await fs.access(bookDir);
      await fs.rmdir(bookDir, { recursive: true });
      console.log('Book folder deleted successfully');
      return { success: true };
    } catch (accessError) {
      if (accessError.code === 'ENOENT') {
        console.log('Folder does not exist, nothing to delete');
        return { success: true };
      }
      throw accessError;
    }
  } catch (error) {
    console.error('Error deleting book folder:', error);
    return { success: false, error: error.message };
  }
});