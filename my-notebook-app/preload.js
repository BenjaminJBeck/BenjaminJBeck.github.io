const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // index.html stuff
  saveNotebookData: (data) => ipcRenderer.invoke('save-notebook-data', data),
  loadNotebookData: () => ipcRenderer.invoke('load-notebook-data'),
  openEditor: (bookId, bookName) => ipcRenderer.invoke('open-editor', bookId, bookName),
  createBookFolder: (bookName) => ipcRenderer.invoke('create-book-folder', bookName),
  deleteBookFolder: (bookName) => ipcRenderer.invoke('delete-book-folder', bookName),

  // legacy (ok to keep)
  saveBookContent: (bookId, bookName, content) => ipcRenderer.invoke('save-book-content', bookId, bookName, content),
  loadBookContent: (bookId, bookName) => ipcRenderer.invoke('load-book-content', bookId, bookName),

  // ✅ editor.html uses these
  loadBookInfo: (bookName) => ipcRenderer.invoke('load-book-info', bookName),
  saveBookInfo: (bookName, info) => ipcRenderer.invoke('save-book-info', bookName, info),
  goBackToIndex: () => ipcRenderer.invoke('go-back-to-index'),

  // ✅ lets editor.html know which book was opened
  getEditorIdentity: () => {
    try {
      const qs = new URLSearchParams(location.search);
      return { bookId: qs.get('bookId'), bookName: qs.get('bookName') };
    } catch { return { bookId: null, bookName: null }; }
  }
});

