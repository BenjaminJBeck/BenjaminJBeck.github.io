<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #f2f4f8;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
}

#left-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 80px;
  height: 100%;
  background: linear-gradient(to bottom, #009ecf, #007ea6);
  border-right: 2px solid #005f7a;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 12px;
  z-index: 2;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

#page-label {
  width: 60px;
  height: 40px;
  background-color: #00688b;
  border-radius: 10px;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 13px;
  font-weight: bold;
  box-shadow: inset 0 0 4px rgba(255,255,255,0.2);
}

.sidebar-button {
  width: 60px;
  height: 60px;
  background-color: #00688b;
  border-radius: 14px;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.sidebar-button:hover {
  background-color: #005f7a;
}

.sidebar-button img {
  width: 34px;
  height: 34px;
}

#bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90px;
  background-color: #009ecf;
  border-top: 2px solid #007ca6;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  overflow-x: auto;
  padding-left: 90px;
  z-index: 2;
}

#page-buttons {
  display: flex;
  align-items: center;
  margin-left: 0;
}

.page-button {
  min-width: 60px;
  height: 60px;
  background-color: #00688b;
  border-radius: 12px;
  margin: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.page-button:hover {
  background-color: #005f7a;
}

.page-button.selected {
  border: 2px solid #ffffff;
}

.page-button.to-delete {
  border: 4px dashed #c00 !important;
}

#corner-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 90px;
  background-color: #009ecf;
  border-top: 2px solid #007ca6;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

#corner-button {
  width: 60px;
  height: 60px;
  background-color: #005f7a;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

#corner-button:hover {
  background-color: #004b64;
}

#corner-button img {
  width: 34px;
  height: 34px;
}

#scene-area {
  position: absolute;
  top: 0;
  left: 80px;
  bottom: 90px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fbfc;
  overflow: hidden;
  z-index: 1;
}

:root {
  --canvas-scale: 0.4;
}

#canvas-wrapper {
  width: 1920px;
  height: 1080px;
  transform: scale(var(--canvas-scale));
  transform-origin: top left;
  position: relative;
}

#actual-canvas {
  width: 1920px;
  height: 1080px;
  background-color: white;
  border: 2px solid #ccc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
}

#button-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #00688b;
  padding: 25px;
  border-radius: 20px;
  display: none;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.popup-btn {
  background-color: #008fb8;
  color: white;
  font-size: 18px;
  padding: 10px 25px;
  margin: 8px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.popup-btn:hover {
  background-color: #007298;
}

#popup-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: #cc0000;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<!-- MAIN INTERFACE -->
<div id="left-box">
  <div id="page-label">PAGE 1</div>
  <div class="sidebar-button" onclick="addBackground()"><img src="BackgroundImageIcon.png" alt="Background"></div>
  <div class="sidebar-button" onclick="addImage()"><img src="PictureImageIcon.png" alt="Image"></div>
  <div class="sidebar-button" onclick="showButtonPopup()"><img src="ClickableIcon.png" alt="Button"></div>
  <div class="sidebar-button" onclick="addMusic()"><img src="MusicIcon.png" alt="Music"></div>
  <div class="sidebar-button" onclick="addTextbox()"><img src="TextboxImageIcon.png" alt="Textbox"></div>
  <div class="sidebar-button" onclick="previewGame()"><img src="PreviewImageIcon.png" alt="Preview"></div>
  <div class="sidebar-button" onclick="openHelpPopup()"><img src="HelpImageIcon.png" alt="Help"></div>
</div>

<div id="scene-area"></div>

<div id="bottom-bar">
  <div id="page-buttons"></div>
</div>

<div id="corner-box">
  <div id="corner-button" onclick="downloadGame()"><img src="DownloadImageIcon.png" alt="Download"></div>
</div>

<div id="button-popup">
  <button id="popup-close" onclick="closeButtonPopup()">x</button>
  <button class="popup-btn" onclick="addNextLevel()">Next Level</button>
  <button class="popup-btn" onclick="addMainMenu()">Main Menu</button>
  <button class="popup-btn" onclick="addSettings()">Settings</button>
  <button class="popup-btn" onclick="addExitGame()">Exit Game</button>
  <button class="popup-btn" onclick="playGame()">Play Game</button>
  <button class="popup-btn" onclick="addSkipLevel()">Skip Level</button>
  <button class="popup-btn" onclick="addHint()">Hint</button>
</div>

<script>
function openHelpPopup() {
  const popup = document.createElement('div');
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    backgroundColor: '#ffffff',
    color: '#333',
    padding: '25px 30px',
    borderRadius: '16px',
    boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
    zIndex: '5000',
    fontFamily: 'Segoe UI, sans-serif'
  });

  popup.innerHTML = `
    <h2 style="margin-top: 0; color: #007ea6; font-size: 20px;">How to Use This App</h2>
    <ul style="padding-left: 20px; font-size: 14px; line-height: 1.6;">
      <li><b>Add Image:</b> Click the image icon to upload and place images on the canvas.</li>
      <li><b>Add Textbox:</b> Click the text icon to insert a text box. You can edit it with the popup.</li>
      <li><b>Move / Resize:</b> Click on any element to move, scale, or rotate using keyboard shortcuts (M/S/R).</li>
      <li><b>Edit:</b> Double-click a textbox or button to open the styling editor.</li>
      <li><b>Music:</b> Upload sounds using the music icon—button clicks, found images, or background music.</li>
      <li><b>Preview Mode:</b> Click the <b>eye icon</b> to test your scene like the final game.</li>
      <li><b>Download:</b> Save your project as a previewable app package.</li>
      <li><b>Pairing:</b> Double-click an image to open the linking popup. You can pair it with a textbox so both appear together during the game.</li>
    </ul>
    <div style="margin-top: 20px; text-align: right;">
      <button onclick="this.parentElement.parentElement.remove()" style="background-color: #007ea6; color: white; padding: 8px 16px; border: none; border-radius: 10px; cursor: pointer;">Close</button>
    </div>
  `;

  document.body.appendChild(popup);
}
</script>


<script>
let currentPage = 1;
let totalPages = 1;
let pages = { 1: [] };
let selectedPageForDelete = null;
let buttonClickSound = null;
let imageFoundSound = null;
let pageMusic = {}; // { pageNumber: Audio }
let currentMusic = null;



const textboxTemplate = {
  text: 'New Textbox',
  backgroundColor: '#008fb8',
  color: 'white',
  borderRadius: '12px',
  borderColor: '#008fb8',
  borderWidth: '2px',
  fontSize: '16px',
  fontFamily: 'Arial',
  textAlign: 'center',
  textShadow: 'none',
  glowColor: '#ffffff',
  glowStrength: '2',
  backgroundImage: ''  // ✅ Added for image support
};

const buttonTemplate = {
  text: 'Click Me',
  backgroundColor: '#00bfff',
  color: 'white',
  borderRadius: '12px',
  borderColor: '#007ca6',
  borderWidth: '2px',
  fontSize: '16px',
  fontFamily: 'Arial',
  textAlign: 'center',
  textShadow: 'none',
  glowColor: '#ffffff',
  glowStrength: '2',
  backgroundImage: ''  // ✅ Added for image support
};




function renderPageButtons() {
  const container = document.getElementById('page-buttons');
  container.innerHTML = '';
  const plusBtn = document.createElement('div');
  plusBtn.className = 'page-button';
  plusBtn.textContent = '+';
  plusBtn.onclick = addPage;
  container.appendChild(plusBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('div');
    let classes = 'page-button';
    if (i === currentPage) classes += ' selected';
    if (i === selectedPageForDelete) classes += ' to-delete';
    btn.className = classes;
    btn.textContent = i;
    btn.onclick = () => handlePageButtonClick(i);
    container.appendChild(btn);
  }
}





function handlePageButtonClick(num) {
  if (isPreview && buttonClickSound) {
    buttonClickSound.currentTime = 0;
    buttonClickSound.play().catch(err => console.log(err));
  }

  if (num === selectedPageForDelete) {
    selectedPageForDelete = null;
  } else if (num === currentPage) {
    selectedPageForDelete = num;
  } else {
    selectedPageForDelete = null;
    setPage(num);
  }

  renderPageButtons();

  // If in preview, handle page music fade
  if (isPreview) {
    if (currentMusic) {
      let fadeOut = setInterval(() => {
        currentMusic.volume -= 0.05;
        if (currentMusic.volume <= 0) {
          clearInterval(fadeOut);
          currentMusic.pause();
        }
      }, 50);
    }

    if (pageMusic[num]) {
      currentMusic = pageMusic[num];
      currentMusic.volume = 1;
      currentMusic.currentTime = 0;
      currentMusic.play().catch(err => console.log(err));
    } else {
      currentMusic = null;
    }
  }
}





function deleteCurrentPage() {
  if (selectedPageForDelete === null) {
    alert('Click the current page button again to mark it for deletion.');
    return;
  }
  if (totalPages === 1) {
    alert("Can't delete the last page.");
    return;
  }
  if (confirm(`Delete page ${selectedPageForDelete}?`)) {
    delete pages[selectedPageForDelete];
    const newPages = {};
    let index = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (pages[i]) newPages[index++] = pages[i];
    }
    pages = newPages;
    totalPages = index - 1;
    currentPage = Math.max(1, currentPage - 1);
    selectedPageForDelete = null;
    renderPageButtons();
    loadScene(currentPage);
  }
}

document.addEventListener('keydown', function(e) {
  if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPageForDelete !== null) {
    deleteCurrentPage();
  }
});




function setPage(num) {
  currentPage = num;
  document.getElementById('page-label').textContent = 'PAGE ' + num;
  renderPageButtons();
  loadScene(num);
}




function addPage() {
  totalPages += 1;
  pages[totalPages] = [];
  currentPage = totalPages;
  renderPageButtons();
  loadScene(currentPage);
}





function loadScene(page) {
  const scene = document.getElementById("scene-area");
  scene.innerHTML = '';
  (pages[page] || []).forEach(el => scene.appendChild(el));
}



function openHelpPopup() {
  const existing = document.getElementById('help-popup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.id = 'help-popup';
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '520px',
    maxWidth: '95vw',
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    padding: '30px',
    zIndex: '3000',
    color: '#333',
    fontFamily: 'Segoe UI, sans-serif',
    lineHeight: '1.6',
  });

  popup.innerHTML = `
    <h2 style="margin-top: 0; font-size: 20px; color: #0077a8;">App Help Guide</h2>
    <ul style="padding-left: 20px; margin-bottom: 20px;">
      <li><strong>Add Image:</strong> Click the image icon to upload and place an image onto the canvas.</li>
      <li><strong>Add Textbox:</strong> Click the textbox icon to insert text. Double-click it to style.</li>
      <li><strong>Buttons:</strong> Use the button icon to add clickable elements.</li>
      <li><strong>Move / Scale / Rotate:</strong> Select an element and press <code>M</code>, <code>S</code>, or <code>R</code> to move, scale, or rotate with your mouse.</li>
      <li><strong>Editor:</strong> Double-click a textbox or button to open its customization panel.</li>
      <li><strong>Music:</strong> Click the music icon to assign background audio, click sounds, or found sounds.</li>
      <li><strong>Preview Mode:</strong> Click the eye icon to view your game in full-screen play mode.</li>
      <li><strong>Download:</strong> Use the download icon to package your scene for sharing.</li>
      <li><strong>Pairing:</strong> Double-click an image to open the pairing popup. You can link it to a textbox so it reveals when the image is clicked.</li>
    </ul>
    <div style="text-align: right;">
      <button onclick="document.getElementById('help-popup').remove()" style="
        background-color: #0077a8;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 16px;
        font-size: 14px;
        cursor: pointer;
      ">Close</button>
    </div>
  `;

  document.body.appendChild(popup);
}



function addBackground() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const bg = document.createElement('div');
        bg.style.position = 'absolute';
        bg.style.top = '0';
        bg.style.left = '0';
        bg.style.width = '100%';
        bg.style.height = '100%';
        bg.style.backgroundImage = `url(${e.target.result})`;
        bg.style.backgroundSize = 'contain';
        bg.style.backgroundRepeat = 'no-repeat';
        bg.style.backgroundPosition = 'center';
        bg.style.backgroundColor = '#ddeeff'; // optional fallback

        // ✅ Prevent background from interfering
        bg.style.pointerEvents = 'none';
        bg.style.userSelect = 'none';
        bg.setAttribute('draggable', 'false');

        // Mark and manage background tracking
        bg.dataset.isBackground = 'true';

        // Remove any existing background
        pages[currentPage] = pages[currentPage].filter(el => !el.dataset.isBackground);
        pages[currentPage].unshift(bg); // Add to back of scene
        loadScene(currentPage);
      };
      reader.readAsDataURL(file);
    }
  };

  input.click();
}






function addImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true; // ✅ allow multiple file selection

  input.onchange = function(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;

        // ✅ Set image in native canvas coordinates
        img.style.position = 'absolute';
        img.style.left = '100px';
        img.style.top = '100px';
        img.style.width = '200px';
        img.style.height = 'auto';

        // ✅ Required styles
        img.style.cursor = 'pointer';
        img.style.transformOrigin = 'center center';
        img.style.userSelect = 'none';

        // ✅ Let canvas-wrapper scale this visually
        img.dataset.native = 'true';

        // Selection logic
        img.onclick = function(ev) {
          ev.stopPropagation();
          if (selectedElement) selectedElement.style.outline = '';
          selectedElement = img;
          img.style.outline = '2px dashed #ff0';
        };

        img.ondblclick = function(ev) {
          ev.stopPropagation();
          if (!isPreview) openLinkDropdown(img);
        };

        // Add to scene and page data
        pages[currentPage].push(img);
        loadScene(currentPage); // ✅ Refresh the scene immediately
      };
      reader.readAsDataURL(file);
    });
  };

  input.click();
}




function addMusic() {
  const popup = document.createElement('div');
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#1c2732',
    padding: '30px',
    borderRadius: '16px',
    zIndex: '3000',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '360px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
    color: 'white',
    fontFamily: 'Segoe UI, sans-serif'
  });

  popup.innerHTML = `<h2 style="margin: 0; text-align: center; font-size: 18px; color: #8ecdf5;">🎵 Music & Sound Effects</h2>`;

  function createFileUpload(labelText, getAudioRef, setAudioCallback, clearCallback) {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.width = '100%';

    const label = document.createElement('label');
    label.textContent = labelText;
    Object.assign(label.style, {
      fontSize: '13px',
      marginBottom: '6px',
      color: '#d4eaff'
    });
    wrapper.appendChild(label);

    const uploadRow = document.createElement('div');
    uploadRow.style.display = 'flex';
    uploadRow.style.alignItems = 'center';
    uploadRow.style.gap = '10px';

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'file';
    hiddenInput.accept = 'audio/*';
    hiddenInput.style.display = 'none';

    const uploadBtn = document.createElement('button');
    uploadBtn.textContent = 'Choose File';
    Object.assign(uploadBtn.style, {
      flex: '1',
      background: '#008fb8',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '6px 12px',
      cursor: 'pointer'
    });
    uploadBtn.onclick = () => hiddenInput.click();

    const fileDisplay = document.createElement('div');
    const currentAudio = getAudioRef();
    fileDisplay.textContent = currentAudio ? currentAudio.src.split('/').pop() : 'No file selected';
    fileDisplay.style.fontSize = '12px';
    fileDisplay.style.color = '#ccc';

    hiddenInput.onchange = e => {
      const file = e.target.files[0];
      if (file) {
        const audioUrl = URL.createObjectURL(file);
        const audioObj = new Audio(audioUrl);
        audioObj.loop = true;
        setAudioCallback(audioObj);
        fileDisplay.textContent = file.name;
      }
    };

    uploadRow.appendChild(uploadBtn);
    uploadRow.appendChild(fileDisplay);
    wrapper.appendChild(uploadRow);
    wrapper.appendChild(hiddenInput);

    const buttonRow = document.createElement('div');
    buttonRow.style.display = 'flex';
    buttonRow.style.justifyContent = 'space-between';
    buttonRow.style.marginTop = '10px';

    const playBtn = document.createElement('button');
    playBtn.textContent = '▶️';
    const stopBtn = document.createElement('button');
    stopBtn.textContent = '⏹';
    const clearBtn = document.createElement('button');
    clearBtn.textContent = '❌';

    [playBtn, stopBtn, clearBtn].forEach(btn => {
      Object.assign(btn.style, {
        backgroundColor: '#444',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px'
      });
    });

    playBtn.onclick = () => {
      const audioRef = getAudioRef();
      if (audioRef) {
        audioRef.currentTime = 0;
        audioRef.play().catch(console.warn);
      }
    };

    stopBtn.onclick = () => {
      const audioRef = getAudioRef();
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
      }
    };

    clearBtn.onclick = () => {
      clearCallback();
      fileDisplay.textContent = 'No file selected';
    };

    buttonRow.append(playBtn, stopBtn, clearBtn);
    wrapper.appendChild(buttonRow);
    popup.appendChild(wrapper);
  }

  createFileUpload('Button Click Sound', () => buttonClickSound, audio => buttonClickSound = audio, () => buttonClickSound = null);
  createFileUpload('Image Found Sound', () => imageFoundSound, audio => imageFoundSound = audio, () => imageFoundSound = null);
  createFileUpload('Page Background Music', () => pageMusic[currentPage], audio => pageMusic[currentPage] = audio, () => pageMusic[currentPage] = null);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  Object.assign(closeBtn.style, {
    marginTop: '20px',
    backgroundColor: '#555',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    cursor: 'pointer'
  });

  closeBtn.onclick = () => {
    // Stop all audio that may be playing
    [buttonClickSound, imageFoundSound, pageMusic[currentPage]].forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    popup.remove();
  };

  popup.appendChild(closeBtn);
  document.body.appendChild(popup);
}





function addTextbox() {
  closeButtonPopup();

  const textbox = document.createElement('div');
  textbox.textContent = textboxTemplate.text;
  textbox.style.position = 'absolute';
  textbox.style.top = '100px';
  textbox.style.left = '100px';
  textbox.style.padding = '10px 20px';
  textbox.style.backgroundColor = textboxTemplate.backgroundColor;
  textbox.style.color = textboxTemplate.color;
  textbox.style.borderRadius = textboxTemplate.borderRadius;
  textbox.style.cursor = 'pointer';
  textbox.style.transformOrigin = 'center center';
  textbox.style.userSelect = 'none';
  textbox.style.borderWidth = textboxTemplate.borderWidth;
  textbox.style.borderStyle = 'solid';
  textbox.style.borderColor = textboxTemplate.borderColor;
  textbox.style.fontSize = textboxTemplate.fontSize;
  textbox.style.fontFamily = textboxTemplate.fontFamily;
  textbox.style.textAlign = textboxTemplate.textAlign;
  textbox.style.textShadow = textboxTemplate.textShadow || 'none';
  textbox.dataset.glowColor = textboxTemplate.glowColor || '#ffffff';
  textbox.dataset.glowStrength = textboxTemplate.glowStrength || '2';

  // ✅ Add background image if set
  if (textboxTemplate.backgroundImage) {
    textbox.style.backgroundImage = `url(${textboxTemplate.backgroundImage})`;
    textbox.style.backgroundSize = 'cover';
    textbox.style.backgroundRepeat = 'no-repeat';
    textbox.style.backgroundPosition = 'center';
  }

  textbox.dataset.native = 'true';

  textbox.onclick = function(ev) {
    ev.stopPropagation();
    if (isPreview) return;
    if (selectedElement) selectedElement.style.outline = '';
    selectedElement = textbox;
    textbox.style.outline = '2px dashed #ff0';
  };

  textbox.ondblclick = function(ev) {
    ev.stopPropagation();
    if (!isPreview) {
      openEditorPopup(textbox, true); // isTextbox = true
    }
  };

  pages[currentPage].push(textbox);
  loadScene(currentPage);
}






function openTextboxEditorPopup(textbox) {
  isEditorOpen = true;
  let popup = document.getElementById('edit-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'edit-popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = '#00c0e4';
    popup.style.padding = '20px';
    popup.style.borderRadius = '20px';
    popup.style.zIndex = '2000';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.alignItems = 'center';
    popup.style.color = 'black';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.gap = '10px';
    document.body.appendChild(popup);
  }

  popup.innerHTML = `
    <h3>Edit Textbox</h3>
    <label>Text Content:
      <textarea id="textbox-content" rows="4" cols="30">${textbox.innerText}</textarea>
    </label>
    <label>Font:
      <select id="font-select">
        <option value="Arial">Arial</option>
        <option value="Verdana">Verdana</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
      </select>
    </label>
    <label>Font Size:
      <input type="number" id="font-size-input" value="${parseInt(textbox.style.fontSize)}">
    </label>
    <label>Text Color:
      <input type="color" id="text-color-input" value="${rgbToHex(textbox.style.color)}">
    </label>
    <button id="apply-edit-btn">Apply</button>
    <button id="close-edit-btn">Close</button>
  `;

  document.getElementById('font-select').value = textbox.style.fontFamily || 'Arial';

  document.getElementById('apply-edit-btn').onclick = () => {
    const newText = document.getElementById('textbox-content').value;
    textbox.innerText = newText; // 🟡 use innerText to preserve line breaks
    textbox.style.fontFamily = document.getElementById('font-select').value;
    textbox.style.fontSize = document.getElementById('font-size-input').value + 'px';
    textbox.style.color = document.getElementById('text-color-input').value;
    popup.style.display = 'none';
    isEditorOpen = false;
  };

  document.getElementById('close-edit-btn').onclick = () => {
    popup.style.display = 'none';
    isEditorOpen = false;
  };

  popup.style.display = 'flex';
}




function downloadGame() { alert("Download game (to implement)"); }





function previewGame() {
  isPreview = true;

  // Hide editor UI
  ['left-box', 'bottom-bar', 'corner-box'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Fullscreen canvas
  const sceneArea = document.getElementById('scene-area');
  Object.assign(sceneArea.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'white',
    zIndex: '1'
  });

  // Scale wrapper
  const originalWidth = 1920;
  const originalHeight = 1080;
  const scale = Math.min(window.innerWidth / originalWidth, window.innerHeight / originalHeight);
  document.documentElement.style.setProperty('--canvas-scale', scale.toString());

  const wrapper = document.getElementById('canvas-wrapper');
  if (wrapper) {
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = 'top left';
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
  }

  // Load current scene
  loadScene(currentPage);

  // Disable all interactivity
  document.querySelectorAll('#actual-canvas img, #actual-canvas div').forEach(el => {
    el.style.pointerEvents = 'none';
    el.style.cursor = 'default';
    el.onclick = null;
    el.ondblclick = null;
  });

  // Resize images (optional)
  document.querySelectorAll('#actual-canvas img').forEach(img => {
    const w = img.offsetWidth;
    const h = img.offsetHeight;
    img.style.width = (w * 2) + 'px';
    img.style.height = (h * 2) + 'px';
  });

  // Disable background interactivity
  document.querySelectorAll('[data-is-background="true"]').forEach(bg => {
    bg.style.pointerEvents = 'none';
  });

  // Track and handle linked images
  const linkedImages = Array.from(document.querySelectorAll('#actual-canvas img[data-paired-textbox]'));
  linkedImages.forEach(img => {
    img.dataset.found = img.dataset.found === 'true' ? 'true' : 'false'; // initialize if missing
    img.style.pointerEvents = 'auto';
    img.style.cursor = 'pointer';

    // If already found, dim it
    if (img.dataset.found === 'true') {
      img.style.opacity = '0.3';
    }

    img.onclick = () => {
      if (img.dataset.found !== 'true') {
        img.dataset.found = 'true';
        img.style.opacity = '0.3';
        checkAllLinkedFoundOnPage();
      }
    };
  });

  // Hide next-level button initially
  const nextButtons = Array.from(document.querySelectorAll('#actual-canvas .next-level-button'));
  nextButtons.forEach(btn => btn.style.display = 'none');

  // Re-check after all image handlers are assigned
  checkAllLinkedFoundOnPage();

  // Escape button
  const escBtn = document.createElement('div');
  Object.assign(escBtn, {
    id: 'exit-preview',
    textContent: 'Escape',
    onclick: exitPreview
  });
  Object.assign(escBtn.style, {
    position: 'fixed',
    top: '10px',
    right: '10px',
    backgroundColor: '#008fb8',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    zIndex: '1000'
  });
  document.body.appendChild(escBtn);

  setupPreviewPairs();

  // Music
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
  }
  if (pageMusic[currentPage]) {
    currentMusic = pageMusic[currentPage];
    currentMusic.loop = true;
    currentMusic.volume = 1;
    currentMusic.currentTime = 0;
    currentMusic.play().catch(err => console.warn('Music error:', err));
  }
}



function showButtonPopup() { document.getElementById('button-popup').style.display = 'flex'; }





function closeButtonPopup() { document.getElementById('button-popup').style.display = 'none'; }





function addSkipLevel() { alert("Add Skip Level button (to implement)"); }





function addHint() { alert("Add Hint button (to implement)"); }





function addNextLevel() {
  closeButtonPopup();

  const btn = document.createElement('div');
  btn.textContent = 'Next Level';
  btn.classList.add('next-level-button');
  btn.dataset.page = currentPage;
  btn.dataset.type = 'nextLevel'; // ✅ Important for tracking in preview mode

  btn.style.position = 'absolute';
  btn.style.top = '100px';
  btn.style.left = '100px';
  btn.style.padding = '10px 20px';
  btn.style.backgroundColor = '#008fb8';
  btn.style.color = 'white';
  btn.style.borderRadius = '12px';
  btn.style.cursor = 'pointer';
  btn.style.transformOrigin = 'center center';
  btn.style.userSelect = 'none';
  btn.style.borderWidth = '2px';
  btn.style.borderStyle = 'solid';
  btn.style.borderColor = '#008fb8';
  btn.style.fontSize = '16px';
  btn.style.textAlign = 'center';
  btn.style.zIndex = '100'; // keeps it above in most cases

  // Selection and page navigation behavior
  btn.onclick = function(ev) {
    ev.stopPropagation();

    if (isPreview) {
      if (currentPage < totalPages) {
        setPage(currentPage + 1);
      } else {
        alert('No next page!');
      }
    } else {
      if (selectedElement) selectedElement.style.outline = '';
      selectedElement = btn;
      btn.style.outline = '2px dashed #ff0';
    }
  };

  // Double-click to open editor (non-preview only)
  btn.ondblclick = function(ev) {
    ev.stopPropagation();
    if (!isPreview) {
      openEditorPopup(btn);
    }
  };

  pages[currentPage].push(btn);
  loadScene(currentPage);
}



function checkAllLinkedFoundOnPage() {
  const pageElements = pages[currentPage];
  const linkedImages = pageElements.filter(el => el.dataset.pairedTextbox);
  const allFound = linkedImages.every(el => el.dataset.found === 'true');
  const nextBtn = pageElements.find(el => el.classList?.contains('next-level-button'));
  if (nextBtn) nextBtn.style.display = allFound ? 'block' : 'none';
}




function addMainMenu() { alert("Add Main Menu button (to implement)"); }




function addSettings() {
  closeButtonPopup();

  const btn = document.createElement('div');
  btn.textContent = 'Settings';
  btn.style.position = 'absolute';
  btn.style.top = '100px';
  btn.style.left = '100px';
  btn.style.padding = '10px 20px';
  btn.style.backgroundColor = '#008fb8';
  btn.style.color = 'white';
  btn.style.borderRadius = '12px';
  btn.style.cursor = 'pointer';
  btn.style.transformOrigin = 'center center';
  btn.style.userSelect = 'none';
  btn.style.borderWidth = '2px';
  btn.style.borderStyle = 'solid';
  btn.style.borderColor = '#008fb8';
  btn.style.fontSize = '16px';
  btn.style.textAlign = 'center';

  // Enable selection + outline
  btn.onclick = function(ev) {
    ev.stopPropagation();

    if (isPreview) {
      const settingsPopup = document.createElement('div');
      settingsPopup.style.position = 'fixed';
      settingsPopup.style.top = '50%';
      settingsPopup.style.left = '50%';
      settingsPopup.style.transform = 'translate(-50%, -50%)';
      settingsPopup.style.background = '#00c0e4';
      settingsPopup.style.padding = '30px';
      settingsPopup.style.borderRadius = '30px';
      settingsPopup.style.zIndex = '3000';
      settingsPopup.style.display = 'flex';
      settingsPopup.style.flexDirection = 'column';
      settingsPopup.style.alignItems = 'center';
      settingsPopup.style.color = 'white';
      settingsPopup.style.width = '400px';
      settingsPopup.style.gap = '20px';

      // Title box
      const titleBox = document.createElement('div');
      titleBox.textContent = 'Settings';
      titleBox.style.backgroundColor = '#008fb8';
      titleBox.style.padding = '10px 20px';
      titleBox.style.borderRadius = '12px';
      titleBox.style.fontSize = '20px';
      titleBox.style.marginBottom = '10px';
      settingsPopup.appendChild(titleBox);

      // Volume slider
      const volumeLabel = document.createElement('label');
      volumeLabel.innerHTML = `Volume:<br><input type="range" id="volume-slider" min="0" max="100" value="50">`;
      settingsPopup.appendChild(volumeLabel);

      const fullscreenBtn = document.createElement('button');
      fullscreenBtn.textContent = 'Toggle Fullscreen';
      fullscreenBtn.style.backgroundColor = '#008fb8';
      fullscreenBtn.style.color = 'white';
      fullscreenBtn.style.border = 'none';
      fullscreenBtn.style.padding = '10px 20px';
      fullscreenBtn.style.borderRadius = '12px';
      fullscreenBtn.style.cursor = 'pointer';
      fullscreenBtn.style.fontSize = '16px';

      const resetBtn = document.createElement('button');
      resetBtn.textContent = 'Reset Game';
      resetBtn.style.backgroundColor = '#008fb8';
      resetBtn.style.color = 'white';
      resetBtn.style.border = 'none';
      resetBtn.style.padding = '10px 20px';
      resetBtn.style.borderRadius = '12px';
      resetBtn.style.cursor = 'pointer';
      resetBtn.style.fontSize = '16px';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close';
      closeBtn.style.backgroundColor = '#008fb8';
      closeBtn.style.color = 'white';
      closeBtn.style.border = 'none';
      closeBtn.style.padding = '10px 20px';
      closeBtn.style.borderRadius = '12px';
      closeBtn.style.cursor = 'pointer';
      closeBtn.style.fontSize = '16px';

      settingsPopup.appendChild(fullscreenBtn);
      settingsPopup.appendChild(resetBtn);
      settingsPopup.appendChild(closeBtn);

      document.body.appendChild(settingsPopup);

      document.getElementById('volume-slider').oninput = function(e) {
        const volume = e.target.value;
        console.log('Volume set to:', volume);
      };

      fullscreenBtn.onclick = function() {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      };

      resetBtn.onclick = function() {
        if (confirm('Are you sure you want to reset the game? This will remove all progress.')) {
          alert('Game progress has been reset.');
        }
      };

      closeBtn.onclick = function() {
        document.body.removeChild(settingsPopup);
      };
    } else {
      if (selectedElement) selectedElement.style.outline = '';
      selectedElement = btn;
      btn.style.outline = '2px dashed #ff0';
    }
  };

  // Double-click to open editor popup
  btn.ondblclick = function(ev) {
    ev.stopPropagation();
    if (!isPreview) {
      openEditorPopup(btn);
    }
  };
  
  // Add to the current page and reload scene
  pages[currentPage].push(btn);
  loadScene(currentPage);
}




function addExitGame() { alert("Add Exit Game button (to implement)"); }
let lastPlayedPage = 2; // Default start for new players





function playGame() {
  closeButtonPopup();

  const btn = document.createElement('div');
  btn.textContent = 'Play Game';
  btn.style.position = 'absolute';
  btn.style.top = '100px';
  btn.style.left = '100px';
  btn.style.padding = '10px 20px';
  btn.style.backgroundColor = '#008fb8';
  btn.style.color = 'white';
  btn.style.borderRadius = '12px';
  btn.style.cursor = 'pointer';
  btn.style.transformOrigin = 'center center';
  btn.style.userSelect = 'none';
  btn.style.borderWidth = '2px';
  btn.style.borderStyle = 'solid';
  btn.style.borderColor = '#008fb8';
  btn.style.fontSize = '16px';
  btn.style.textAlign = 'center';

  // Enable selection + outline
  btn.onclick = function(ev) {
    ev.stopPropagation();

    if (isPreview) {
      // Jump to last played page without alert
      if (lastPlayedPage > totalPages) {
        lastPlayedPage = 2; // fallback to page 2 if out of bounds
      }
      setPage(lastPlayedPage);
    } else {
      if (selectedElement) selectedElement.style.outline = '';
      selectedElement = btn;
      btn.style.outline = '2px dashed #ff0';
    }
  };

  // Double-click to open editor popup
  btn.ondblclick = function(ev) {
    ev.stopPropagation();
    if (!isPreview) {
      openEditorPopup(btn);
    }
  };

  // Add to the current page and reload scene
  pages[currentPage].push(btn);
  loadScene(currentPage);
}





// Helper: update lastPlayedPage when user moves to a new page
function setPage(num) {
  currentPage = num;
  document.getElementById('page-label').textContent = 'PAGE ' + num;
  renderPageButtons();
  loadScene(num);

  if (isPreview && num > lastPlayedPage) {
    lastPlayedPage = num; // update progress
  }
}
let isPreview = false;






function exitPreview() {
  isPreview = false;

  document.getElementById('left-box').style.display = 'flex';
  document.getElementById('bottom-bar').style.display = 'flex';
  document.getElementById('corner-box').style.display = 'flex';

  const sceneArea = document.getElementById('scene-area');
  sceneArea.style.left = '80px';
  sceneArea.style.bottom = '100px';
  sceneArea.style.width = '';
  sceneArea.style.height = '';
  sceneArea.style.position = '';
  sceneArea.style.top = '';
  sceneArea.style.right = '';
  sceneArea.style.backgroundColor = '';
  sceneArea.style.zIndex = '';

  const escBtn = document.getElementById('exit-preview');
  if (escBtn) escBtn.remove();

  // 🔇 Stop music if playing
  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
    currentMusic = null;
  }

  // Restore visibility of all Next Level buttons on this page
  const pageElements = pages[currentPage] || [];
  const nextBtn = pageElements.find(el => el.classList?.contains('next-level-button'));
  if (nextBtn) nextBtn.style.display = 'block';

  loadScene(currentPage);
  restoreEditorHandlers(); // Restore original editing interactions

  // ✅ Re-enable pointer interactions except for backgrounds
  sceneArea.querySelectorAll('div, img').forEach(el => {
    if (el.dataset.isBackground === 'true') {
      el.style.pointerEvents = 'none';
      return;
    }

    el.style.pointerEvents = 'auto';
    el.style.cursor = 'pointer';

    el.onclick = function(ev) {
      ev.stopPropagation();
      if (selectedElement) selectedElement.style.outline = '';
      selectedElement = el;
      el.style.outline = '2px dashed #ff0';
    };

    if (el.tagName === 'IMG') {
      el.ondblclick = function(ev) {
        ev.stopPropagation();
        if (!isPreview) openLinkDropdown(el);
      };
    } else if (el.tagName === 'DIV') {
      el.ondblclick = function(ev) {
        ev.stopPropagation();
        if (!isPreview) openEditorPopup(el, true);
      };
    }
  });

  // Reset paired item visibility
  pairedItems.forEach(pair => {
    pair.textbox.style.display = 'block';
    pair.textbox.style.opacity = 1;
    pair.image.style.display = 'block';
    pair.image.style.opacity = 1;
  });

  // Show chain icons again
  document.querySelectorAll('.pair-icon').forEach(icon => {
    icon.style.display = 'block';
  });

  // Remove sparkles
  document.querySelectorAll('.sparkle').forEach(s => s.remove());
}




renderPageButtons();
let selectedElement = null;
let currentMode = null;
let isDragging = false, startX, startY;
let isEditorOpen = false;

document.getElementById('scene-area').addEventListener('mousedown', function(e) {
  if (selectedElement && currentMode) {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    if (currentMode === 'm') {
      selectedElement.startLeft = parseInt(selectedElement.style.left);
      selectedElement.startTop = parseInt(selectedElement.style.top);
    } else if (currentMode === 'r') {
      const rect = selectedElement.getBoundingClientRect();
      selectedElement.centerX = rect.left + rect.width / 2;
      selectedElement.centerY = rect.top + rect.height / 2;
    } else if (currentMode === 's') {
      selectedElement.startWidth = selectedElement.offsetWidth;
    }
  }
});

document.getElementById('scene-area').addEventListener('mousemove', function(e) {
  if (isDragging && selectedElement && currentMode === 'm') {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    selectedElement.style.left = (selectedElement.startLeft + dx) + 'px';
    selectedElement.style.top = (selectedElement.startTop + dy) + 'px';

    if (selectedElement.tagName === 'DIV') {
      const scene = document.getElementById('scene-area');
      const parentRect = scene.getBoundingClientRect();
      const selRect = selectedElement.getBoundingClientRect();
      const selCenterX = selRect.left + selRect.width / 2;
      const selCenterY = selRect.top + selRect.height / 2;

      // Clear old guide lines
      document.querySelectorAll('.snap-guide').forEach(g => g.remove());

      // Snap to container center
      const parentCenterX = parentRect.left + parentRect.width / 2;
      const parentCenterY = parentRect.top + parentRect.height / 2;

      if (Math.abs(selCenterX - parentCenterX) < 10) {
        selectedElement.style.left = (parentRect.width / 2 - selRect.width / 2) + 'px';
        addGuideLine('vertical', parentCenterX);
      }
      if (Math.abs(selCenterY - parentCenterY) < 10) {
        selectedElement.style.top = (parentRect.height / 2 - selRect.height / 2) + 'px';
        addGuideLine('horizontal', parentCenterY);
      }

      // Snap to container edges
      if (Math.abs(selRect.left - parentRect.left) < 10) {
        selectedElement.style.left = '0px';
        addGuideLine('vertical', parentRect.left);
      }
      if (Math.abs(selRect.right - parentRect.right) < 10) {
        selectedElement.style.left = (parentRect.width - selRect.width) + 'px';
        addGuideLine('vertical', parentRect.right);
      }
      if (Math.abs(selRect.top - parentRect.top) < 10) {
        selectedElement.style.top = '0px';
        addGuideLine('horizontal', parentRect.top);
      }
      if (Math.abs(selRect.bottom - parentRect.bottom) < 10) {
        selectedElement.style.top = (parentRect.height - selRect.height) + 'px';
        addGuideLine('horizontal', parentRect.bottom);
      }

      // Snap to other DIVs (skip self and images)
      scene.querySelectorAll('div').forEach(other => {
        if (other !== selectedElement) {
          const otherRect = other.getBoundingClientRect();
          const otherCenterX = otherRect.left + otherRect.width / 2;
          const otherCenterY = otherRect.top + otherRect.height / 2;

          if (Math.abs(selCenterX - otherCenterX) < 10) {
            selectedElement.style.left = (other.offsetLeft + other.offsetWidth / 2 - selRect.width / 2) + 'px';
            addGuideLine('vertical', otherCenterX);
          }
          if (Math.abs(selCenterY - otherCenterY) < 10) {
            selectedElement.style.top = (other.offsetTop + other.offsetHeight / 2 - selRect.height / 2) + 'px';
            addGuideLine('horizontal', otherCenterY);
          }
        }
      });
    }
  }
  else if (isDragging && selectedElement && currentMode === 'r') {
    const dx = e.clientX - selectedElement.centerX;
    const dy = e.clientY - selectedElement.centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = Math.round(angle / 15) * 15;
    selectedElement.style.transform = `rotate(${angle}deg)`;
  }
  else if (isDragging && selectedElement && currentMode === 's') {
    const dx = e.clientX - startX;
    const scale = Math.max(0.1, 1 + dx / 100);
    selectedElement.style.width = (selectedElement.startWidth * scale) + 'px';
  }
});


function restoreEditorHandlers() {
  const sceneArea = document.getElementById('scene-area');

  sceneArea.querySelectorAll('div, img').forEach(el => {
    if (el.dataset.isBackground) return; // Skip background layer

    el.style.pointerEvents = 'auto';
    el.style.cursor = 'pointer';

    // Selection
    el.onclick = function(ev) {
      ev.stopPropagation();
      if (selectedElement && selectedElement !== el) {
        selectedElement.style.outline = '';
      }
      selectedElement = el;
      el.style.outline = '2px dashed #ff0';
    };

    // Dragging
    el.onmousedown = function(ev) {
      if (isPreview) return;
      ev.stopPropagation();

      if (selectedElement && selectedElement !== el) {
        selectedElement.style.outline = '';
      }
      selectedElement = el;
      el.style.outline = '2px dashed #ff0';

      const startX = ev.clientX;
      const startY = ev.clientY;
      const origLeft = parseInt(el.style.left) || 0;
      const origTop = parseInt(el.style.top) || 0;

      function onMouseMove(moveEv) {
        const dx = moveEv.clientX - startX;
        const dy = moveEv.clientY - startY;
        el.style.left = (origLeft + dx) + 'px';
        el.style.top = (origTop + dy) + 'px';
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        el.style.outline = '2px dashed #ff0'; // Maintain selection
      }

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    // Double-click for editor or link dropdown
    if (el.tagName === 'IMG') {
      el.ondblclick = function(ev) {
        ev.stopPropagation();
        if (!isPreview) openLinkDropdown(el);
      };
    } else if (el.tagName === 'DIV') {
      el.ondblclick = function(ev) {
        ev.stopPropagation();
        if (!isPreview) openEditorPopup(el, true);
      };
    }
  });
}


// Helper: add snap guide lines
function addGuideLine(type, pos) {
  const guide = document.createElement('div');
  guide.className = 'snap-guide';
  guide.style.position = 'fixed';
  guide.style.background = 'red';
  guide.style.opacity = '0.5';
  guide.style.zIndex = '5000';
  if (type === 'vertical') {
    guide.style.left = pos + 'px';
    guide.style.top = '0';
    guide.style.width = '1px';
    guide.style.height = '100%';
  } else {
    guide.style.top = pos + 'px';
    guide.style.left = '0';
    guide.style.height = '1px';
    guide.style.width = '100%';
  }
  document.body.appendChild(guide);
}

// Clear guide lines on mouseup
document.getElementById('scene-area').addEventListener('mouseup', function() {
  isDragging = false;
  document.querySelectorAll('.snap-guide').forEach(g => g.remove());
});

document.getElementById('scene-area').addEventListener('mouseup', function() {
  isDragging = false;
});

let pairedItems = []; // stores { image, textbox }

// === SHIFT + CLICK SELECTION ===
document.getElementById('scene-area').addEventListener('click', function(e) {
  if (isPreview) return;

  const clicked = e.target;
  if (e.shiftKey && (clicked.tagName === 'IMG' || (clicked.tagName === 'DIV' && clicked.textContent))) {
    if (selectedPair.length < 2 && !selectedPair.includes(clicked)) {
      selectedPair.push(clicked);
      clicked.style.boxShadow = '0 0 10px 4px yellow';
    }
  } else {
    selectedPair.forEach(el => el.style.boxShadow = '');
    selectedPair = [];
  }
});

// === PRESS 'L' TO PAIR ===
document.addEventListener('keydown', function(e) {
  if (e.key === 'l' || e.key === 'L') {
    if (selectedPair.length === 2) {
      const img = selectedPair.find(el => el.tagName === 'IMG');
      const text = selectedPair.find(el => el.tagName === 'DIV' && el.textContent);

      if (img && text) {
        pairedItems.push({ image: img, textbox: text });
alert('Paired image and textbox!');
      } else {
        alert('You must select one image and one textbox to pair.');
      }

      selectedPair.forEach(el => el.style.boxShadow = '');
      selectedPair = [];
    }
  }

  // === PRESS 'U' TO UNPAIR ===
  if (e.key === 'u' || e.key === 'U') {
    if (selectedPair.length === 2) {
      const img = selectedPair.find(el => el.tagName === 'IMG');
      const text = selectedPair.find(el => el.tagName === 'DIV' && el.textContent);

      if (img && text) {
        pairedItems = pairedItems.filter(pair => !(pair.image === img && pair.textbox === text));
        removePairMarker(img);
        removePairMarker(text);
        alert('Unpaired image and textbox.');
      } else {
        alert('You must select one image and one textbox to unpair.');
      }

      selectedPair.forEach(el => el.style.boxShadow = '');
      selectedPair = [];
    }
  }

  // === PRESS CTRL + R TO RESET ALL PAIRS ===
  if ((e.key === 'r' || e.key === 'R') && e.ctrlKey) {
    resetAllPairs();
  }
});

// === HELPER: ADD 🔗 MARKER ===
function addPairMarker(element) {
  if (element.querySelector('.pair-icon')) return;

  const icon = document.createElement('div');
  icon.className = 'pair-icon';
  icon.textContent = '🔗';
  icon.style.position = 'absolute';
  icon.style.top = '-10px';
  icon.style.right = '-10px';
  icon.style.fontSize = '16px';
  icon.style.pointerEvents = 'none';
  element.style.position = 'absolute';
  element.appendChild(icon);
}

// === HELPER: REMOVE 🔗 MARKER ===
function removePairMarker(element) {
  const icon = element.querySelector('.pair-icon');
  if (icon) icon.remove();
}

// === HELPER: RESET ALL PAIRS ===
function resetAllPairs() {
  pairedItems.forEach(pair => {
    removePairMarker(pair.image);
    removePairMarker(pair.textbox);
  });
  pairedItems = [];
  alert('All pairs have been cleared.');
}

// === SETUP PAIRED IMAGE CLICK IN PREVIEW ===
function setupPreviewPairs() {
  // Hide chain icons during preview
  document.querySelectorAll('.pair-icon').forEach(icon => icon.style.display = 'none');

  pairedItems.forEach(pair => {
    pair.image.style.cursor = 'default';
    pair.image.onclick = function() {
      if (isPreview) {
        // Play image-found sound if set
        if (imageFoundSound) {
          imageFoundSound.currentTime = 0;
          imageFoundSound.play().catch(err => console.log(err));
        }

        // Spawn sparkles over image
        createSparkles(pair.image);

        let imgOpacity = 1;
        let textOpacity = 1;

        const fade = setInterval(() => {
          imgOpacity -= 0.05;
          textOpacity -= 0.05;

          pair.image.style.opacity = imgOpacity;
          pair.textbox.style.opacity = textOpacity;

          if (imgOpacity <= 0 && textOpacity <= 0) {
            clearInterval(fade);

            // Hide both after fade
            pair.image.style.display = 'none';
            pair.textbox.style.display = 'none';

            // Remove chain icons if they exist (defensive check)
            removePairMarker(pair.image);
            removePairMarker(pair.textbox);
          }
        }, 50);
      }
    };
  });
}



function createSparkles(element) {
  const scene = document.getElementById('scene-area');
  const colors = ['#fff8dc', '#ffd700', '#fffacd', '#f5deb3', '#ffe4b5'];  // soft gold tones

  for (let i = 0; i < 35; i++) {
    const sparkle = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];

    sparkle.style.position = 'absolute';
    sparkle.style.width = '3px';
    sparkle.style.height = '3px';
    sparkle.style.background = color;
    sparkle.style.borderRadius = '50%';
    sparkle.style.left = (element.offsetLeft + Math.random() * element.offsetWidth) + 'px';
    sparkle.style.top = (element.offsetTop + Math.random() * element.offsetHeight) + 'px';
    sparkle.style.opacity = 1;
    sparkle.style.pointerEvents = 'none';
    sparkle.style.boxShadow = `0 0 10px 6px ${color}`;
    sparkle.style.transition = 'transform 1.2s ease-out, opacity 1.2s ease-out';

    scene.appendChild(sparkle);

    // Random float movement outward
    const dx = (Math.random() - 0.5) * 60;
    const dy = (Math.random() - 0.5) * 60;

    setTimeout(() => {
      sparkle.style.transform = `translate(${dx}px, ${dy}px) scale(1.8)`;
      sparkle.style.opacity = 0;
    }, 10);

    setTimeout(() => {
      sparkle.remove();
    }, 1300);
  }
}






document.getElementById('scene-area').addEventListener('click', function(e) {
  if (selectedElement) {
    selectedElement.style.outline = '';
    selectedElement = null;
    currentMode = null;
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'm' || e.key === 'M') {
    currentMode = 'm';
  } else if (e.key === 'r' || e.key === 'R') {
    currentMode = 'r';
  } else if (e.key === 's' || e.key === 'S') {
    currentMode = 's';
  } else if (e.key === 'Escape') {
    if (selectedElement) selectedElement.style.outline = '';
    selectedElement = null;
    currentMode = null;
  }
});

const editorPopup = document.createElement('div');
editorPopup.id = 'editor-popup';
editorPopup.style.position = 'fixed';
editorPopup.style.top = '50%';
editorPopup.style.left = '50%';
editorPopup.style.transform = 'translate(-50%, -50%)';
editorPopup.style.background = '#fff';
editorPopup.style.border = '2px solid #008fb8';
editorPopup.style.padding = '20px';
editorPopup.style.zIndex = '2000';
editorPopup.style.display = 'none';
editorPopup.innerHTML = `
  <h3>Edit Button</h3>
  Shape: <select id="shapeSelect">
    <option value="12px">Rounded</option>
    <option value="0">Square</option>
  </select><br><br>
  Background Color: <input type="color" id="bgColor"><br><br>
  Border Size: <input type="number" id="borderSize" min="0" value="2"> px<br><br>
  Border Color: <input type="color" id="borderColor"><br><br>
  Transparency: <input type="range" id="opacity" min="0" max="1" step="0.1" value="1"><br><br>
  Font: <input type="text" id="fontFamily" placeholder="e.g., Arial"><br><br>
  Font Size: <input type="number" id="fontSize" min="8" value="16"> px<br><br>
  Text Color: <input type="color" id="textColor"><br><br>
  Center Text: <input type="checkbox" id="centerText"><br><br>
  <button onclick="applyEdits()">Apply</button>
  <button onclick="closeEditorPopup()">Close</button>
`;
document.body.appendChild(editorPopup);

let editingElement = null;






function closeEditorPopup() {
  editorPopup.style.display = 'none';
  isEditorOpen = false;
}





function applyEdits() {
  if (!editingElement) return;
  editingElement.style.borderRadius = document.getElementById('shapeSelect').value;
  editingElement.style.backgroundColor = document.getElementById('bgColor').value;
  editingElement.style.borderWidth = document.getElementById('borderSize').value + 'px';
  editingElement.style.borderStyle = 'solid';
  editingElement.style.borderColor = document.getElementById('borderColor').value;
  editingElement.style.opacity = document.getElementById('opacity').value;
  editingElement.style.fontFamily = document.getElementById('fontFamily').value;
  editingElement.style.fontSize = document.getElementById('fontSize').value + 'px';
  editingElement.style.color = document.getElementById('textColor').value;
  editingElement.style.textAlign = document.getElementById('centerText').checked ? 'center' : 'left';
  closeEditorPopup();
}





// Helper: convert RGB to HEX
function rgbToHex(rgb) {
  if (!rgb) return '#000000';
  const result = rgb.match(/\d+/g);
  if (!result) return '#000000';
  return '#' + result.slice(0, 3).map(x => (+x).toString(16).padStart(2, '0')).join('');
}




function openEditorPopup(element, isTextbox = false) {
  isEditorOpen = true;

  let popup = document.getElementById('edit-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'edit-popup';
    Object.assign(popup.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '600px',
      maxWidth: '95vw',
      height: '480px',
      maxHeight: '90vh',
      backgroundColor: 'white',
      borderRadius: '14px',
      zIndex: '3000',
      display: 'flex',
      boxShadow: '0 2px 20px rgba(0,0,0,0.25)',
      overflow: 'hidden',
      fontFamily: 'Segoe UI, sans-serif',
    });
    document.body.appendChild(popup);
  }

  const text = element.textContent || '';
  const radius = parseInt(element.style.borderRadius) || 0;
  const fontSize = parseInt(element.style.fontSize) || 16;
  const bgColor = rgbToHex(element.style.backgroundColor || '#008fb8');
  const borderColor = rgbToHex(element.style.borderColor || '#ffffff');
  const textColor = rgbToHex(element.style.color || '#000000');
  const borderSize = parseInt(element.style.borderWidth) || 1;
  const fontFamily = element.style.fontFamily || 'Arial';
  const opacity = element.style.opacity || 1;
  const align = element.style.textAlign || 'left';
  const glowColor = element.dataset.glowColor || '#ffffff';
  const glowStrength = element.dataset.glowStrength || '2';
  const glowEnabled = element.style.textShadow && element.style.textShadow !== 'none';
  const backgroundImage = element.style.backgroundImage?.replace(/^url\(["']?/, '').replace(/["']?\)$/, '') || '';

  popup.innerHTML = `
    <div style="width: 50%; background-color: #1c2732; color: white; padding: 20px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto;">
      <h3 style="margin: 0; font-size: 16px; color: #8ecdf5;">${isTextbox ? 'Textbox' : 'Button'} Editor</h3>
      ${isTextbox ? `
        <label style="font-size: 13px;">Text:
          <input type="text" id="content-input" value="${text}" style="width: 100%; padding: 6px; margin-top: 4px; border-radius: 6px; border: 1px solid #ccc; background-color: white; color: black;">
        </label>` : ''
      }
      <label style="font-size: 13px;">Border Radius:
        <input type="number" id="shape-input" value="${radius}" style="width: 100%; margin-top: 4px; background-color: white; color: black;">
      </label>
      <label style="font-size: 13px;">Box Color:
        <input type="color" id="box-color-input" value="${bgColor}" style="width: 100%; margin-top: 4px; background-color: white; color: black;">
      </label>
      <label style="font-size: 13px;">Border Size:
        <input type="number" id="border-size-input" value="${borderSize}" style="width: 100%; margin-top: 4px; background-color: white; color: black;">
      </label>
      <label style="font-size: 13px;">Border Color:
        <input type="color" id="border-color-input" value="${borderColor}" style="width: 100%; margin-top: 4px; background-color: white; color: black;">
      </label>
      <label style="font-size: 13px;">Font:
        <select id="font-select" style="width: 100%; padding: 6px; margin-top: 4px; background-color: white; color: black;">
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
        </select>
      </label>
      <label style="font-size: 13px;">Font Size:
        <input type="number" id="font-size-input" value="${fontSize}" style="width: 100%; margin-top: 4px; background-color: white; color: black;">
      </label>
      <label style="font-size: 13px;">Text Color:
        <input type="color" id="text-color-input" value="${textColor}" style="width: 100%; margin-top: 4px; background-color: white; color: black;">
      </label>
      <label style="font-size: 13px;">Background Image:
        <input type="file" id="bg-image-input" accept="image/*" style="margin-top: 4px;">
      </label>
      <label style="font-size: 13px;">
        <input type="checkbox" id="centered-input" ${align === 'center' ? 'checked' : ''}> Centered
      </label>
      <label style="font-size: 13px;">
        <input type="checkbox" id="glow-toggle" ${glowEnabled ? 'checked' : ''}> Glow Text
      </label>
      <label style="font-size: 13px;">Glow Color:
        <input type="color" id="glow-color-input" value="${glowColor}" style="width: 100%;">
      </label>
      <label style="font-size: 13px;">Glow Strength:
        <input type="range" id="glow-strength-input" min="1" max="10" value="${glowStrength}" style="width: 100%;">
      </label>
      <div style="margin-top: auto; display: flex; gap: 10px;">
        <button id="apply-edit-btn" style="flex: 1; background: #008fb8; color: white; border: none; border-radius: 6px; padding: 8px;">Apply</button>
        <button id="close-edit-btn" style="flex: 1; background: #555; color: white; border: none; border-radius: 6px; padding: 8px;">Close</button>
      </div>
    </div>

    <div id="live-preview" style="width: 50%; display: flex; justify-content: center; align-items: center; background: #1c2732;">
      <div id="preview-box" style="
        background-color: ${bgColor};
        background-image: url('${backgroundImage}');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        border: ${borderSize}px solid ${borderColor};
        border-radius: ${radius}px;
        font-size: ${fontSize}px;
        font-family: ${fontFamily};
        color: ${textColor};
        opacity: ${opacity};
        padding: 10px 20px;
        text-align: ${align};
        max-width: 90%;
        white-space: pre-wrap;
        ${glowEnabled ? `text-shadow: 0 0 ${glowStrength}px ${glowColor};` : ''}
      ">${text}</div>
    </div>
  `;

  document.getElementById('font-select').value = fontFamily;

  const previewBox = popup.querySelector('#preview-box');

  popup.querySelectorAll('input, select').forEach(input => {
    input.oninput = () => {
      const shape = document.getElementById('shape-input').value + 'px';
      const bg = document.getElementById('box-color-input').value;
      const borderW = document.getElementById('border-size-input').value + 'px';
      const borderC = document.getElementById('border-color-input').value;
      const font = document.getElementById('font-select').value;
      const fSize = document.getElementById('font-size-input').value + 'px';
      const color = document.getElementById('text-color-input').value;
      const align = document.getElementById('centered-input').checked ? 'center' : 'left';
      const glowOn = document.getElementById('glow-toggle').checked;
      const glowColor = document.getElementById('glow-color-input').value;
      const glowStrength = document.getElementById('glow-strength-input').value;
      const content = isTextbox ? document.getElementById('content-input')?.value || '' : '';
      const file = document.getElementById('bg-image-input').files[0];
      const imgUrl = file ? URL.createObjectURL(file) : '';

      previewBox.style.borderRadius = shape;
      previewBox.style.backgroundColor = bg;
      previewBox.style.border = `${borderW} solid ${borderC}`;
      previewBox.style.fontFamily = font;
      previewBox.style.fontSize = fSize;
      previewBox.style.color = color;
      previewBox.style.textAlign = align;
      previewBox.style.textShadow = glowOn ? `0 0 ${glowStrength}px ${glowColor}` : 'none';
      previewBox.style.backgroundImage = imgUrl ? `url(${imgUrl})` : '';
      previewBox.style.backgroundSize = 'cover';
      previewBox.style.backgroundRepeat = 'no-repeat';
      previewBox.style.backgroundPosition = 'center';
      previewBox.textContent = isTextbox ? content : previewBox.textContent;
    };
  });

  document.getElementById('apply-edit-btn').onclick = () => {
    const imageFile = document.getElementById('bg-image-input').files[0];
    const imageURL = imageFile ? URL.createObjectURL(imageFile) : '';

    element.style.borderRadius = document.getElementById('shape-input').value + 'px';
    element.style.backgroundColor = document.getElementById('box-color-input').value;
    element.style.borderWidth = document.getElementById('border-size-input').value + 'px';
    element.style.borderColor = document.getElementById('border-color-input').value;
    element.style.fontFamily = document.getElementById('font-select').value;
    element.style.fontSize = document.getElementById('font-size-input').value + 'px';
    element.style.color = document.getElementById('text-color-input').value;
    element.style.textAlign = document.getElementById('centered-input').checked ? 'center' : 'left';
    element.style.textShadow = document.getElementById('glow-toggle').checked
      ? `0 0 ${document.getElementById('glow-strength-input').value}px ${document.getElementById('glow-color-input').value}`
      : 'none';

    element.dataset.glowColor = document.getElementById('glow-color-input').value;
    element.dataset.glowStrength = document.getElementById('glow-strength-input').value;

    if (imageURL) {
      element.style.backgroundImage = `url(${imageURL})`;
      element.style.backgroundSize = 'cover';
      element.style.backgroundRepeat = 'no-repeat';
      element.style.backgroundPosition = 'center';
    }

    if (isTextbox) {
      const content = document.getElementById('content-input').value;
      element.textContent = content;

      textboxTemplate.text = content;
      textboxTemplate.fontFamily = element.style.fontFamily;
      textboxTemplate.fontSize = element.style.fontSize;
      textboxTemplate.color = element.style.color;
      textboxTemplate.backgroundColor = element.style.backgroundColor;
      textboxTemplate.borderColor = element.style.borderColor;
      textboxTemplate.borderWidth = element.style.borderWidth;
      textboxTemplate.borderRadius = element.style.borderRadius;
      textboxTemplate.textAlign = element.style.textAlign;
      textboxTemplate.textShadow = element.style.textShadow;
      textboxTemplate.glowColor = element.dataset.glowColor;
      textboxTemplate.glowStrength = element.dataset.glowStrength;
      textboxTemplate.backgroundImage = imageURL;
    }

    document.getElementById('edit-popup')?.remove();
    isEditorOpen = false;
  };

  document.getElementById('close-edit-btn').onclick = () => {
    popup.remove();
    isEditorOpen = false;
  };
}




function openLinkDropdown(img) {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.background = '#00c0e4';
  popup.style.padding = '20px';
  popup.style.borderRadius = '20px';
  popup.style.zIndex = '3000';
  popup.style.display = 'flex';
  popup.style.flexDirection = 'column';
  popup.style.alignItems = 'center';
  popup.style.color = 'black';
  popup.style.fontFamily = 'Arial, sans-serif';
  popup.style.gap = '10px';
  popup.style.minWidth = '250px';

  const headerBox = document.createElement('div');
  headerBox.textContent = 'Link Image';
  headerBox.style.background = '#008fb8';
  headerBox.style.color = 'white';
  headerBox.style.padding = '10px 20px';
  headerBox.style.borderRadius = '12px';
  headerBox.style.fontSize = '20px';
  headerBox.style.textAlign = 'center';
  popup.appendChild(headerBox);

  const select = document.createElement('select');
  select.style.padding = '8px';
  select.style.borderRadius = '8px';
  select.style.border = '1px solid #008fb8';
  pages[currentPage].forEach(el => {
    if (el.tagName === 'DIV' && el.textContent) {
      const option = document.createElement('option');
      option.value = el.textContent;
      option.textContent = el.textContent;
      select.appendChild(option);
    }
  });
  popup.appendChild(select);

  const buttonRow = document.createElement('div');
  buttonRow.style.display = 'flex';
  buttonRow.style.gap = '10px';
  buttonRow.style.marginTop = '10px';

  const linkBtn = document.createElement('button');
  linkBtn.textContent = 'Link';
  linkBtn.style.background = '#008fb8';
  linkBtn.style.color = 'white';
  linkBtn.style.padding = '10px 20px';
  linkBtn.style.border = 'none';
  linkBtn.style.borderRadius = '12px';
  linkBtn.style.cursor = 'pointer';
  linkBtn.onclick = function() {
    const selectedText = select.value;
    const textbox = pages[currentPage].find(el => el.tagName === 'DIV' && el.textContent === selectedText);
    if (textbox) {
      pairedItems.push({ image: img, textbox });
      addPairMarker(img);
      addPairMarker(textbox);
      alert(`Linked image to "${selectedText}"`);
    }
    document.body.removeChild(popup);
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.background = '#005f7a';  // darker blue
  cancelBtn.style.color = 'white';
  cancelBtn.style.padding = '10px 20px';
  cancelBtn.style.border = 'none';
  cancelBtn.style.borderRadius = '12px';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.onclick = function() {
    document.body.removeChild(popup);
  };

  buttonRow.appendChild(linkBtn);
  buttonRow.appendChild(cancelBtn);
  popup.appendChild(buttonRow);

  document.body.appendChild(popup);
}


function resizeCanvasToFit() {
  const wrapper = document.getElementById('canvas-wrapper');
  if (!wrapper) return;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const scaleX = screenWidth / 1920;
  const scaleY = screenHeight / 1080;
  const scale = Math.min(scaleX, scaleY); // Keep aspect ratio

  wrapper.style.transform = `scale(${scale})`;
  wrapper.style.transformOrigin = 'top left';
}


function setCanvasScalePreview() {
  const scaleX = window.innerWidth / 1920;
  const scaleY = window.innerHeight / 1080;
  const scale = Math.min(scaleX, scaleY);
  document.documentElement.style.setProperty('--canvas-scale', scale.toString());
}


document.addEventListener('keydown', function (e) {
  if (e.key === 'Delete' && selectedElement && !isPreview) {
    selectedElement.remove();

    // Also remove from the page data array
    const index = pages[currentPage].indexOf(selectedElement);
    if (index !== -1) pages[currentPage].splice(index, 1);

    selectedElement = null;
  }
});


</script>




















6/6/25

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: #f2f4f8;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
}

#left-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 80px;
  height: 100%;
  background: linear-gradient(to bottom, #009ecf, #007ea6);
  border-right: 2px solid #005f7a;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 12px;
  z-index: 2;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

#page-label {
  width: 60px;
  height: 40px;
  background-color: #00688b;
  border-radius: 10px;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 13px;
  font-weight: bold;
  box-shadow: inset 0 0 4px rgba(255,255,255,0.2);
}

.sidebar-button {
  width: 60px;
  height: 60px;
  background-color: #00688b;
  border-radius: 14px;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.sidebar-button:hover {
  background-color: #005f7a;
}

.sidebar-button img {
  width: 34px;
  height: 34px;
}

#bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90px;
  background-color: #009ecf;
  border-top: 2px solid #007ca6;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  overflow-x: auto;
  padding-left: 90px;
  z-index: 2;
}

#page-buttons {
  display: flex;
  align-items: center;
  margin-left: 0;
}

.page-button {
  min-width: 60px;
  height: 60px;
  background-color: #00688b;
  border-radius: 12px;
  margin: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.page-button:hover {
  background-color: #005f7a;
}

.page-button.selected {
  border: 2px solid #ffffff;
}

.page-button.to-delete {
  border: 4px dashed #c00 !important;
}

#corner-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 90px;
  background-color: #009ecf;
  border-top: 2px solid #007ca6;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
}

#corner-button {
  width: 60px;
  height: 60px;
  background-color: #005f7a;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

#corner-button:hover {
  background-color: #004b64;
}

#corner-button img {
  width: 34px;
  height: 34px;
}

#scene-area {
  position: absolute;
  top: 0;
  left: 80px;
  bottom: 90px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fbfc;
  overflow: hidden;
  z-index: 1;
}

:root {
  --canvas-scale: 0.4;
}

#canvas-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#actual-canvas {
  width: 100%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  aspect-ratio: 16 / 9;
  background-color: white;
  border: 2px solid #ccc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
}

#button-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #00688b;
  padding: 25px;
  border-radius: 20px;
  display: none;
  flex-direction: column;
  align-items: center;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.popup-btn {
  background-color: #008fb8;
  color: white;
  font-size: 18px;
  padding: 10px 25px;
  margin: 8px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.popup-btn:hover {
  background-color: #007298;
}

#popup-close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: #cc0000;
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.preview-fullscreen #scene-area {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10000;
  background-color: #f9fbfc;
}

.preview-fullscreen #canvas-wrapper {
  transform: scale(1);
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.preview-fullscreen #actual-canvas {
  margin: auto;
}

.preview-fullscreen #actual-canvas img {
  pointer-events: auto;       /* still clickable */
  user-select: none;          /* can't select */
  cursor: default !important; /* no move/pointer/crosshair */
}

.selectable {
  cursor: pointer;
}

.selectable.selected {
  outline: 1px dashed #00aaff;
  outline-offset: -1px;
  position: relative;
}

.preview-fullscreen #actual-canvas img {
  pointer-events: auto;
  user-select: none;
  cursor: default !important;
}

.sidebar-button, .page-button, #corner-button, .popup-btn {
  pointer-events: auto !important;
  user-select: auto !important;
}


</style>
<!-- MAIN INTERFACE -->
<div id="left-box">
  <div id="page-label">PAGE 1</div>
  <div class="sidebar-button" onclick="addBackground()"><img src="BackgroundImageIcon.png" alt="Background"></div>
  <div class="sidebar-button" onclick="addImage()"><img src="PictureImageIcon.png" alt="Image"></div>
  <div class="sidebar-button" onclick="showButtonPopup()"><img src="ClickableIcon.png" alt="Button"></div>
  <div class="sidebar-button" onclick="addMusic()"><img src="MusicIcon.png" alt="Music"></div>
  <div class="sidebar-button" onclick="addTextbox()"><img src="TextboxImageIcon.png" alt="Textbox"></div>
  <div class="sidebar-button" onclick="previewGame()"><img src="PreviewImageIcon.png" alt="Preview"></div>
  <div class="sidebar-button" onclick="viewCode()"><img src="ShowCodeImageIcon.png" alt="Show Code"></div>
  <div class="sidebar-button" onclick="openHelpPopup()"><img src="HelpImageIcon.png" alt="Help"></div>
</div>

<div id="scene-area">
  <div id="canvas-wrapper">
  <div id="actual-canvas"></div>
  </div>
</div>


<div id="bottom-bar">
  <div id="page-buttons"></div>
</div>

<div id="corner-box">
  <div id="corner-button" onclick="downloadGame()"><img src="DownloadImageIcon.png" alt="Download"></div>
</div>

<div id="button-popup">
  <button id="popup-close" onclick="closeButtonPopup()">x</button>
  <button class="popup-btn" onclick="addNextLevel()">Next Level</button>
  <button class="popup-btn" onclick="addMainMenu()">Main Menu</button>
  <button class="popup-btn" onclick="addSettings()">Settings</button>
  <button class="popup-btn" onclick="addExitGame()">Exit Game</button>
  <button class="popup-btn" onclick="playGame()">Play Game</button>
  <button class="popup-btn" onclick="addSkipLevel()">Skip Level</button>
  <button class="popup-btn" onclick="addHint()">Hint</button>
</div>

<script src="https://cdn.jsdelivr.net/npm/jszip@3.10.0/dist/jszip.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js"></script>


<script>

//
//
//
//
// Variables
//
//
//
//


let selectedElement = null;
let currentPage = 1;
let totalPages = 1;
let pages = { 1: [] };
let selectedPageForDelete = null;
let interactionMode = null; // 'move' | 'scale' | 'rotate'
let isMouseDown = false;

//
//
//
//
//
// Functions
//
//
//
//




function previewGame() {
  document.body.classList.add('preview-fullscreen');
  document.getElementById('left-box').style.display = 'none';
  document.getElementById('bottom-bar').style.display = 'none';
  document.getElementById('corner-box').style.display = 'none';
}

function exitPreview() {
  document.body.classList.remove('preview-fullscreen');
  document.getElementById('left-box').style.display = '';
  document.getElementById('bottom-bar').style.display = '';
  document.getElementById('corner-box').style.display = '';
}

function addImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';

  input.onchange = function () {
    const files = input.files;
    if (!files.length) return;

    for (const file of files) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;

        img.classList.add('selectable');
        img.style.position = 'absolute';
        img.style.top = '10%';
        img.style.left = '10%';
        img.style.width = '10%';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.draggable = false;
        img.style.cursor = 'default';

        img.onclick = function (ev) {
  ev.stopPropagation();
  document.querySelectorAll('.selectable').forEach(el => el.classList.remove('selected'));
  img.classList.add('selected');
  selectedElement = img;
};

        document.getElementById('actual-canvas').appendChild(img);
        pages[currentPage].push(img);  // 🔥 Save to current page
      };
      reader.readAsDataURL(file);
    }
  };

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

function addBackground() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';

  input.onchange = function () {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const url = e.target.result;
      const canvas = document.getElementById('actual-canvas');
      canvas.style.backgroundImage = `url('${url}')`;
      canvas.style.backgroundSize = 'contain';
      canvas.style.backgroundPosition = 'center';
      canvas.style.backgroundRepeat = 'no-repeat';

      // 🔥 Save background as a property of the page
      if (!pages[currentPage].meta) pages[currentPage].meta = {};
      pages[currentPage].meta.background = url;
    };
    reader.readAsDataURL(file);
  };

  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}


function renderPageButtons() {
  const container = document.getElementById('page-buttons');
  container.innerHTML = '';
  const plusBtn = document.createElement('div');
  plusBtn.className = 'page-button';
  plusBtn.textContent = '+';
  plusBtn.onclick = addPage;
  container.appendChild(plusBtn);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('div');
    let classes = 'page-button';
    if (i === currentPage) classes += ' selected';
    if (i === selectedPageForDelete) classes += ' to-delete';
    btn.className = classes;
    btn.textContent = i;
    btn.onclick = () => handlePageButtonClick(i);
    container.appendChild(btn);
  }
}

function handlePageButtonClick(num) {
  if (num === selectedPageForDelete) {
    selectedPageForDelete = null;
  } else if (num === currentPage) {
    selectedPageForDelete = num;
  } else {
    selectedPageForDelete = null;
    setPage(num);
  }
  renderPageButtons();
}

function setPage(num) {
  currentPage = num;
  document.getElementById('page-label').textContent = 'Page ' + num;
  renderPageButtons();
  loadScene(num);
}

function addPage() {
  totalPages += 1;
  pages[totalPages] = [];
  currentPage = totalPages;
  renderPageButtons();
  loadScene(currentPage);
}

function loadScene(page) {
  const canvas = document.getElementById("actual-canvas");
  canvas.innerHTML = '';

  // Restore background
  const bg = pages[page]?.meta?.background;
  if (bg) {
    canvas.style.backgroundImage = `url('${bg}')`;
    canvas.style.backgroundSize = 'contain';
    canvas.style.backgroundPosition = 'center';
    canvas.style.backgroundRepeat = 'no-repeat';
  } else {
    canvas.style.backgroundImage = '';
  }

  // Restore page elements
  (pages[page] || []).forEach(el => {
    if (el instanceof Element) {
      canvas.appendChild(el);
    }
  });
}

function deleteCurrentPage() {
  if (selectedPageForDelete === null) {
    alert('Click the current page button again to mark it for deletion.');
    return;
  }
  if (totalPages === 1) {
    alert("Can't delete the last page.");
    return;
  }
  if (confirm(`Delete page ${selectedPageForDelete}?`)) {
    delete pages[selectedPageForDelete];
    const newPages = {};
    let index = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (pages[i]) newPages[index++] = pages[i];
    }
    pages = newPages;
    totalPages = index - 1;
    currentPage = Math.max(1, currentPage - 1);
    selectedPageForDelete = null;
    renderPageButtons();
    loadScene(currentPage);
  }
}

function getScale(el) {
  const match = el.style.transform.match(/scale\(([^)]+)\)/);
  return match ? parseFloat(match[1]) : 1;
}

function getRotation(el) {
  const match = el.style.transform.match(/rotate\(([^)]+)deg\)/);
  return match ? parseFloat(match[1]) : 0;
}

function getScale(el) {
  const match = el.style.transform.match(/scale\(([^)]+)\)/);
  return match ? parseFloat(match[1]) : 1;
}

function getRotation(el) {
  const match = el.style.transform.match(/rotate\(([^)]+)deg\)/);
  return match ? parseFloat(match[1]) : 0;
}



function viewCode() {
  // Prepare game data summary
  let gameData = {
    canvas: {
      width: document.getElementById('actual-canvas').offsetWidth + 'px',
      height: document.getElementById('actual-canvas').offsetHeight + 'px',
    },
    pages: {}
  };

  for (const [pageNum, elements] of Object.entries(pages)) {
    gameData.pages[pageNum] = {
      background: elements.meta?.background || null,
      elements: []
    };

for (const el of elements) {
  if (!(el instanceof Element)) continue;

  const top = el.style.top || '';
  const left = el.style.left || '';
  const width = el.style.width || '';
  const height = el.style.height || '';

  const rotationMatch = el.style.transform.match(/rotate\(([^)]+)deg\)/);
  const rotation = rotationMatch ? parseFloat(rotationMatch[1]) : 0;

  const scaleMatch = el.style.transform.match(/scale\(([^)]+)\)/);
  const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

  const src = el.src ? el.src.split('/').pop().split('?')[0] : null;

  gameData.pages[pageNum].elements.push({
    tag: el.tagName.toLowerCase(),
    src: src,
    top,
    left,
    width,
    height,
    rotation,
    scale,
    style: el.style.cssText
  });
}
  }

  // Format nicely as JSON string for readability
  const output = JSON.stringify(gameData, null, 2);

  // Create popup with textarea and buttons (copy, close)
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.backgroundColor = '#00688b';
  popup.style.padding = '25px';
  popup.style.borderRadius = '20px';
  popup.style.display = 'flex';
  popup.style.flexDirection = 'column';
  popup.style.alignItems = 'center';
  popup.style.zIndex = 1000;
  popup.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
  popup.style.width = '80vw';
  popup.style.height = '80vh';

  const textarea = document.createElement('textarea');
  textarea.style.flexGrow = '1';
  textarea.style.width = '100%';
  textarea.style.height = '100%';
  textarea.style.fontFamily = 'monospace';
  textarea.value = output;

  // Button container
  const btnContainer = document.createElement('div');
  btnContainer.style.marginTop = '10px';
  btnContainer.style.display = 'flex';
  btnContainer.style.gap = '10px';

  // Copy button
  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copy';
  copyBtn.className = 'popup-btn';
  copyBtn.onclick = () => {
    textarea.select();
    document.execCommand('copy');
  };

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.className = 'popup-btn';
  closeBtn.onclick = () => popup.remove();

  btnContainer.appendChild(copyBtn);
  btnContainer.appendChild(closeBtn);

  popup.appendChild(textarea);
  popup.appendChild(btnContainer);
  document.body.appendChild(popup);
}

//
//
//
//
// Listeners
//
//
//
//

renderPageButtons();
loadScene(currentPage);


document.addEventListener('keydown', function(e) {
  if (!selectedElement) return;

  if (e.key.toLowerCase() === 'm') {
    interactionMode = 'move';
  } else if (e.key.toLowerCase() === 's') {
    interactionMode = 'scale';
  } else if (e.key.toLowerCase() === 'r') {
    interactionMode = 'rotate';
  }
});



document.addEventListener('keydown', function (e) {
  // Escape exits preview
  if (e.key === "Escape") {
    exitPreview();
  }

  // Delete or Backspace for page deletion
  if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPageForDelete !== null) {
    deleteCurrentPage(); // ✅ relies on your defined deleteCurrentPage()
  }

  // Delete for element or double-selected page
  if (e.key === "Delete") {
    // Delete selected element
    if (selectedElement && getComputedStyle(document.getElementById('button-popup')).display === 'none') {
      if (confirm("Do you want to delete this element?")) {
        selectedElement.remove();
        selectedElement = null;
      }
    }

    // Delete selected page if it's not the current one
    if (selectedPageForDelete && selectedPageForDelete !== currentPage) {
      if (confirm("Do you want to delete page " + selectedPageForDelete + "?")) {
        delete pages[selectedPageForDelete];
        if (selectedPageForDelete === totalPages) totalPages--;
        if (currentPage > totalPages) currentPage = totalPages;
        selectedPageForDelete = null;
        renderPageButtons();
        loadScene(currentPage);
      }
    }
  }
});

// Deselect element when clicking on empty canvas
document.getElementById('canvas-wrapper').addEventListener('click', function (e) {
  if (e.target.id === 'canvas-wrapper' || e.target.id === 'actual-canvas') {
    document.querySelectorAll('.selectable').forEach(el => el.classList.remove('selected'));
    selectedElement = null;
  }
});


document.addEventListener('mousedown', function(e) {
  if (!selectedElement || (interactionMode !== 'move' && interactionMode !== 'scale' && interactionMode !== 'rotate')) return;
  isMouseDown = true;
});

document.addEventListener('mouseup', function() {
  if (interactionMode === 'move' || interactionMode === 'scale' || interactionMode === 'rotate') {
    isMouseDown = false;
    interactionMode = null; // stop interaction but keep selected
  }
});

document.addEventListener('mousemove', function(e) {
  if (!selectedElement || !interactionMode || !isMouseDown) return;

  const canvas = document.getElementById('actual-canvas');
  const rect = canvas.getBoundingClientRect();

  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  if (interactionMode === 'move') {
    selectedElement.style.left = `${x}%`;
    selectedElement.style.top = `${y}%`;
  }

  if (interactionMode === 'scale') {
    const box = selectedElement.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    const scale = Math.max(0.05, dist / 150);
    selectedElement.style.transform = `scale(${scale}) rotate(${getRotation(selectedElement)}deg)`;
  }

  if (interactionMode === 'rotate') {
    const box = selectedElement.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
    selectedElement.style.transform = `rotate(${angle}deg) scale(${getScale(selectedElement)})`;
  }
});
</script>