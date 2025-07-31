function viewCode() {
  const existingPopup = document.getElementById('code-popup');
  if (existingPopup) {
    existingPopup.remove();
    document.querySelector('div[style*="position: fixed"][style*="z-index: 99999"]')?.remove(); // also removes blocker
    return;
  }
  
  
  
  let gameData = {
    canvas: {
      width: '1088px',
      height: '612px',
    },
    pages: {}
  };
  
  for (const [pageNum, elements] of Object.entries(pages)) {
    const backgroundFilename = elements.meta?.backgroundFilename || null;
    
const config = elements.meta?.textboxConfig || {};

gameData.pages[pageNum] = {
  background: backgroundFilename,
  config, // ← include this to preserve animation settings
  elements: []
};
    
    for (const el of elements) {
  if (!(el instanceof Element)) continue;
  if (!el || !el.style) continue;
      
      const top = el.style.top || '';
      const left = el.style.left || '';
      const width = el.style.width || '';
      const height = el.style.height || '';
      const rotationMatch = el.style.transform.match(/rotate\(([^)]+)deg\)/);
const rotation = rotationMatch ? rotationMatch[1] : '0';
const scaleMatch = el.style.transform.match(/scale\(([^)]+)\)/);
const scale = scaleMatch ? scaleMatch[1] : '1';

const tag = el.tagName.toLowerCase();
const isTextbox = el.classList.contains("textbox-container") && !el.classList.contains("image-preview-container");

let style = el.style.cssText;

// Add non-clickable styling to textboxes
if (isTextbox) {
  style += 'pointer-events: none;';
}

let configData = el.dataset.config ? JSON.parse(el.dataset.config) : null;
if (el.tagName.toLowerCase() === 'img' && el.dataset.name) {
  configData = { ...(configData || {}), name: el.dataset.name };
}
const textboxItems = el.querySelectorAll('.textbox-item');
if (textboxItems.length > 0 || el.innerText.trim().length > 0) {
  configData = {
    isTextboxContainer: true,
    items: Array.from(textboxItems.length > 0 ? textboxItems : [el]).map(e => ({
      text: e.textContent,
      style: '', // ← Strip styling
      linkedName: e.dataset.linkedname || ''
    }))
  };
}

gameData.pages[pageNum].elements.push({
  tag,
  src: el.dataset.filename || null,
  top,
  left,
  width,
  height,
  rotation,
  scale,
  style,
  content: el.innerText || el.textContent || '',
  config: configData
});
    }
  }
  
  const htmlCode = `
  <style>
    :root {
      --canvas-scale: 1;
    }
  
  html, body {
    margin: 0;
    padding: 0;
    background: black;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    font-family: 'Segoe UI', sans-serif;
  }
  
  #canvas-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(var(--canvas-scale));
  width: 1088px;
  height: 612px;
  background-color: white;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

img, button {
  position: absolute;
}

button {
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  background-color: #008fb8;
    color: white;
  cursor: pointer;
}

button:hover {
  background-color: #007099;
}


.textbox-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
body[data-has-cursor-image="true"] {
  cursor: none !important;
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
}

body[data-has-cursor-image="true"] * {
  cursor: none !important;
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
}

#preview-cursor {
  position: fixed;
  width: 64px;
  height: 64px;
  pointer-events: none;
  z-index: 9999;
}

@font-face { font-family: 'VTC Goblin Hand Bold'; src: url('fonts/VTC Goblin Hand Bold.ttf') format('truetype'); }
@font-face { font-family: 'VTC Goblin Hand Italic'; src: url('fonts/VTC Goblin Hand Italic.ttf') format('truetype'); }
@font-face { font-family: 'VTC Goblin Hand Regular'; src: url('fonts/VTC Goblin Hand Regular.ttf') format('truetype'); }
@font-face { font-family: 'VTC Goblin Hand'; src: url('fonts/VTC Goblin Hand.ttf') format('truetype'); }
@font-face { font-family: 'Waltograph'; src: url('fonts/Waltograph.ttf') format('truetype'); }
@font-face { font-family: 'Waltograph Bold'; src: url('fonts/Waltograph Bold.ttf') format('truetype'); }
@font-face { font-family: 'Blood & Horror'; src: url('fonts/Blood & Horror.otf') format('opentype'); }
@font-face { font-family: 'Cartoon Marker'; src: url('fonts/Cartoon Marker.ttf') format('truetype'); }
@font-face { font-family: 'Death Star'; src: url('fonts/Death Star.otf') format('opentype'); }
@font-face { font-family: 'Finding Nemo'; src: url('fonts/Finding Nemo.ttf') format('truetype'); }
@font-face { font-family: 'Harry Potter'; src: url('fonts/Harry Potter.ttf') format('truetype'); }
@font-face { font-family: 'Indiana Jones'; src: url('fonts/Indiana Jones.otf') format('opentype'); }
@font-face { font-family: 'Indiana Jones Hollow'; src: url('fonts/Indiana Jones Hollow.otf') format('opentype'); }
@font-face { font-family: 'Jurassic Park'; src: url('fonts/Jurassic Park.ttf') format('truetype'); }
@font-face { font-family: 'Lazarrous'; src: url('fonts/Lazarrous.ttf') format('truetype'); }
@font-face { font-family: 'Linotype Didot Bold'; src: url('fonts/Linotype Didot Bold.otf') format('opentype'); }
@font-face { font-family: 'Marker'; src: url('fonts/Marker.ttf') format('truetype'); }
@font-face { font-family: 'Minecraft'; src: url('fonts/Minecraft.ttf') format('truetype'); }
@font-face { font-family: 'Puzzled'; src: url('fonts/Puzzled.ttf') format('truetype'); }
@font-face { font-family: 'Stranger Things'; src: url('fonts/Stranger Things.ttf') format('truetype'); }
@font-face { font-family: 'Stranger Things Outlined'; src: url('fonts/Stranger Things Outlined.ttf') format('truetype'); }
@font-face { font-family: 'The Last Of Us'; src: url('fonts/The Last Of Us.ttf') format('truetype'); }
@font-face { font-family: 'The Last Of Us Extreme'; src: url('fonts/The Last Of Us Extreme.ttf') format('truetype'); }
@font-face { font-family: 'The Last Of Us Rough'; src: url('fonts/The Last Of Us Rough.ttf') format('truetype'); }
@font-face { font-family: 'Vintage'; src: url('fonts/Vintage.ttf') format('truetype'); }

</style>
  <div id="canvas-wrapper" id="actual-canvas"></div>
  
<script src="Scripts/animations.js"></script>
<script>
const cursorImgSrc = localStorage.getItem('cursorImage');
if (cursorImgSrc) {
  document.body.setAttribute('data-has-cursor-image', 'true');

  const cursorSize = parseFloat(localStorage.getItem('cursorSize') || '100');
  const img = new Image();
  img.src = cursorImgSrc;
  img.onload = () => {
    const cursor = document.createElement('img');
    cursor.src = cursorImgSrc;
    cursor.id = 'preview-cursor';
    cursor.style.position = 'fixed';
    cursor.style.zIndex = '99999';
    cursor.style.pointerEvents = 'none';
    cursor.style.width = cursorSize * 0.3 + 'px';
    cursor.style.height = 'auto';
    document.body.appendChild(cursor);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, img.width, img.height).data;

    let offsetX = 0, offsetY = 0;
    outer: for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        if (data[(y * img.width + x) * 4 + 3] > 0) {
          offsetX = x;
          offsetY = y;
          break outer;
        }
      }
    }

    const scaleRatio = (cursorSize * 0.3) / img.width;
    const finalOffsetX = offsetX * scaleRatio;
    const finalOffsetY = offsetY * scaleRatio;

    document.addEventListener('mousemove', function moveCursor(e) {
      const c = document.getElementById('preview-cursor');
      if (c) {
        c.style.left = (e.clientX - finalOffsetX) + 'px';
        c.style.top = (e.clientY - finalOffsetY) + 'px';
      } else {
        document.removeEventListener('mousemove', moveCursor);
      }
    });
  };
}
const gameData = ${JSON.stringify(gameData, null, 2)};
const currentPage = "1";
let selectedImagePath = null;

function updatePreviewImageBox() {
  const previewBox = document.getElementById('image-preview-box');
  if (!previewBox) return;

  const oldImg = previewBox.querySelector('img');
  if (oldImg) {
    oldImg.style.transition = 'opacity 0.4s ease';
    oldImg.style.opacity = '0';
    setTimeout(() => {
      previewBox.innerHTML = '';
      insertNewImage(previewBox);
    }, 300);
  } else {
    insertNewImage(previewBox);
  }
}

function insertNewImage(previewBox) {
  if (selectedImagePath) {
    const img = document.createElement('img');
img.src = selectedImagePath;
img.draggable = false;
img.addEventListener('dragstart', e => e.preventDefault());
img.style.width = '70%';
img.style.height = '70%';
img.style.objectFit = 'contain';
img.style.filter = 'brightness(0) drop-shadow(2px 2px 4px black)';
img.style.opacity = '0';
img.style.transition = 'opacity 0.4s ease';
previewBox.appendChild(img);

    requestAnimationFrame(() => {
      img.style.opacity = '1';
    });
  }
}


function loadScene(pageNum) {
  const canvas = document.getElementById('canvas-wrapper');
  canvas.innerHTML = '';
  
  const bg = gameData.pages[pageNum]?.background;
  if (bg) {
    canvas.style.backgroundImage = \`url('\${bg}')\`;
  }
  
  const elements = gameData.pages[pageNum]?.elements || [];
  elements.forEach(elData => {
    let el;
    if (elData.tag === 'img') {
  el = document.createElement('img');
  el.src = elData.src || '';
  el.draggable = false;
  el.addEventListener('dragstart', e => e.preventDefault());
} else if (elData.tag === 'button') {
      el = document.createElement('button');
      el.textContent = elData.content || 'Button';
      el.addEventListener('click', () => alert('Button clicked!'));
    
} else if (elData.tag === 'div' && elData.config?.isTextboxContainer && elData.src === "textbox_box") {
  el = document.createElement('div');
  el.className = 'textbox-container';

  // Extract individual styles, apply them manually
  el.style.position = 'absolute';
  el.style.width = elData.width || '80%';
  el.style.height = elData.height || '20%';
  el.style.left = elData.left || '50%';
el.style.bottom = elData.bottom || '0';
if (elData.left === '50%') {
  el.style.transform = elData.transform || 'translateX(-50%)';
}

  // Add any other specific styles from config.style
  const tempDiv = document.createElement('div');
  tempDiv.style.cssText = elData.style || '';
  for (let i = 0; i < tempDiv.style.length; i++) {
    const prop = tempDiv.style[i];
    if (!['left', 'bottom', 'transform', 'position', 'width', 'height'].includes(prop)) {
      el.style[prop] = tempDiv.style[prop];
    }
  }

const items = elData.config.items || [];
items.forEach(item => {
  const linkedName = item.linkedName?.trim();
  const itemDiv = document.createElement('div');

  if (linkedName && linkedName !== 'none') {
    itemDiv.className = 'textbox-item';
    itemDiv.dataset.linkedname = linkedName;
  }

  if (typeof item === 'string') {
    itemDiv.textContent = item;
  } else {
    itemDiv.textContent = item.text || '';
    itemDiv.setAttribute('style', item.style || '');
  }

  el.appendChild(itemDiv);
});

} else {
  el = document.createElement(elData.tag);

  // If it's a container_box, skip adding inner text
  if (elData.src !== 'container_box') {
    el.innerHTML = elData.content || '';
  }
}
    
    const tempDiv = document.createElement('div');
tempDiv.style.cssText = elData.style || '';
for (let i = 0; i < tempDiv.style.length; i++) {
  const prop = tempDiv.style[i];
  el.style[prop] = tempDiv.style[prop];
}

    el.style.position = 'absolute';
    if (elData.src === 'imagePreview_box') {
  el.id = 'image-preview-box';
}
    canvas.appendChild(el);
    if (elData.tag === 'div' && elData.config?.isTextboxContainer) {
  el.querySelectorAll('.textbox-item').forEach(box => {
    const linkedName = box.dataset.linkedname;
    if (!linkedName) return;

    // Find matching image with that name
    const matchedImage = elements.find(e =>
      e.tag === 'img' &&
      e.config?.name === linkedName
    );

 if (matchedImage?.src) {
  box.addEventListener('click', () => {
    selectedImagePath = matchedImage.src;
    updatePreviewImageBox();
  });
}
  });
}
        const assignedNames = gameData.pages[pageNum]?.config?.assignedNames || [];
if (elData.tag === 'img' && elData.config?.name && assignedNames.includes(elData.config.name)) {
  el.dataset.name = elData.config?.name || '';
el.addEventListener('click', async (event) => {
  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const tempImg = new Image();
  tempImg.crossOrigin = 'anonymous';
  tempImg.src = el.src;

  try {
    await tempImg.decode(); // wait for it to load
    const canvas = document.createElement('canvas');
    canvas.width = tempImg.width;
    canvas.height = tempImg.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(tempImg, 0, 0);

    const px = ctx.getImageData(
      Math.floor(x / el.offsetWidth * canvas.width),
      Math.floor(y / el.offsetHeight * canvas.height),
      1, 1
    ).data;

    if (px[3] === 0) return; // transparent, do nothing
  } catch (e) {
    // If the image fails (e.g. tainted canvas), continue as fallback
  }

  const imageAnim = gameData.pages[pageNum]?.config?.imageAnimation || 'fade';
  const textboxAnim = gameData.pages[pageNum]?.config?.textboxAnimation || 'fade';

    // Animate image using external animation functions
if (imageAnim === 'fade') {
  runfade(el);
} else if (imageAnim === 'anim1') {
  runanim1(el);
} else if (imageAnim === 'anim2') {
  runanim2(el);
} else if (imageAnim === 'customanim') {
  //lkjdlkjf203942092
} else {
  runfade(el);
}


document.querySelectorAll('.textbox-item').forEach(box => {

  if (box.dataset.linkedname === el.dataset.name) {

    const container = box.closest('.textbox-container');

    if (container) {

      if (textboxAnim === 'fade') {

        container.style.transition = 'opacity 0.6s ease';

        container.offsetHeight;

        container.style.opacity = '0';

      } else if (textboxAnim === 'shade') {

        container.style.background = 'rgba(0, 0, 0, 0.5)';

      } else if (textboxAnim === 'cross') {

        box.style.textDecoration = 'line-through';

        box.style.opacity = '0.6';

      } else {

        container.style.display = 'none';

        container.style.opacity = '1';
      }
    }
  }
});
  });
}
  });
}




function scaleCanvas() {
  const scaleX = window.innerWidth / 1088;
  const scaleY = window.innerHeight / 612;
  const scale = Math.min(scaleX, scaleY);
  document.documentElement.style.setProperty('--canvas-scale', scale);
}

window.addEventListener('resize', scaleCanvas);
window.addEventListener('load', () => {
  scaleCanvas();
  loadScene(currentPage);
});
<\/script>
  `;

const popup = document.createElement('div');
popup.id = 'code-popup'; // Apply your new CSS
const titleBar = document.createElement('div');
titleBar.textContent = 'View Code';
titleBar.style.background = '#0097b2';
titleBar.style.color = 'white';
titleBar.style.fontSize = '20px';
titleBar.style.fontWeight = 'bold';
titleBar.style.padding = '12px 20px';
titleBar.style.borderRadius = '14px';
titleBar.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
titleBar.style.marginBottom = '16px';
titleBar.style.textAlign = 'center';
titleBar.style.width = '100%';
titleBar.style.display = 'flex';
titleBar.style.justifyContent = 'center';
popup.style.pointerEvents = 'auto';

const blocker = document.createElement('div');
blocker.style.position = 'fixed';
blocker.style.top = '0';
blocker.style.left = '0';
blocker.style.right = '0';
blocker.style.bottom = '0';
blocker.style.backgroundColor = 'transparent';
blocker.style.zIndex = 99999;
blocker.style.pointerEvents = 'none';

const textarea = document.createElement('textarea');
textarea.style.flexGrow = '1';
textarea.style.width = '100%';
textarea.style.height = '500px';
textarea.style.fontFamily = 'monospace';
const placeholder = "//lkjdlkjf203942092";
const customCode = (gameData.pages["1"]?.config?.imageCustomCode || '').trim();
textarea.value = htmlCode.replace(placeholder, customCode);

const btnContainer = document.createElement('div');
btnContainer.style.marginTop = '10px';
btnContainer.style.display = 'flex';
btnContainer.style.gap = '10px';

const copyBtn = document.createElement('button');
copyBtn.className = 'code-popup-button';
copyBtn.textContent = 'Copy';
copyBtn.onclick = () => {
  navigator.clipboard.writeText(textarea.value);
  copyBtn.textContent = 'Copied!';
  setTimeout(() => copyBtn.textContent = 'Copy', 1500);
};

const closeBtn = document.createElement('button');
closeBtn.className = 'code-popup-button';
closeBtn.textContent = 'Close';
closeBtn.onclick = () => {
  popup.remove();
  blocker.remove();
};

btnContainer.appendChild(copyBtn);
btnContainer.appendChild(closeBtn);
popup.appendChild(titleBar);
popup.appendChild(textarea);
popup.appendChild(btnContainer);
document.body.appendChild(blocker);
document.body.appendChild(popup);
}