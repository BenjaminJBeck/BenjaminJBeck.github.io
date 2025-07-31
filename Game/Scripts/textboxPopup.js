function showTextboxPopup() {
  const existingPopup = document.getElementById('textbox-popup');
if (existingPopup) {
  existingPopup.remove();
  document.querySelector('div[style*="position: fixed"][style*="z-index: 99999"]')?.remove(); // optional blocker
  return;
}
  
  
  if (document.getElementById('textbox-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'textbox-popup';
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#00cfee',
    padding: '30px 30px 60px 30px',
    borderRadius: '28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    fontFamily: 'Segoe UI, sans-serif',
    width: '260px',
    gap: '14px'
  });

  const title = document.createElement('div');
  title.textContent = 'Add Box';
  Object.assign(title.style, {
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'white'
  });
  popup.appendChild(title);

  const makeButton = (label, boxType) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    Object.assign(btn.style, {
      width: '100%',
      padding: '10px 0',
      fontSize: '15px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: '#0097b2',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease'
    });
    btn.onmouseenter = () => btn.style.transform = 'scale(1.03)';
    btn.onmouseleave = () => btn.style.transform = 'scale(1)';
    btn.onclick = () => {
      popup.remove();
      spawnCanvasBox(boxType);
    };
    return btn;
  };

  popup.appendChild(makeButton('Textbox', 'textbox'));
  popup.appendChild(makeButton('Container', 'container'));
  popup.appendChild(makeButton('Image Preview', 'imagePreview'));

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  Object.assign(cancelBtn.style, {
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 'normal',
    color: 'white',
    backgroundColor: 'gray',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  });
  cancelBtn.onclick = () => popup.remove();
  popup.appendChild(cancelBtn);

  document.body.appendChild(popup);
}
function spawnCanvasBox(type) {
  const canvas = document.getElementById('actual-canvas');
  if (!canvas) return alert('Canvas not found!');

  const box = document.createElement('div');
  box.classList.add('selectable');
  box.dataset.boxType = type;
  box.dataset.isCanvasBox = "true";
  box.dataset.dataurl = '';
  box.dataset.filename = `${type}_box`;

  Object.assign(box.style, {
  position: 'absolute',
  top: '10%',
  left: '10%',
  width: '10%',
  maxWidth: '100%',
height: type === 'textbox' ? 'auto' : '15%',
minHeight: type === 'textbox' ? 'auto' : '80px',
  background: '#a9eaff',
  borderRadius: '16px',
  border: '2px solid #0097b2',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  cursor: 'default',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  fontFamily: 'Segoe UI, sans-serif',
  color: '#007090',
  zIndex: '10',
  userSelect: 'none',
  pointerEvents: 'auto'
});

  if (type === 'textbox') {
  box.textContent = 'Textbox';
  box.classList.add('textbox-item');
  
}

  if (type === 'imagePreview') {
  const img = new Image();
  img.src = box.dataset.previewPath || 'Butterfly.png';

  img.onload = () => {
    // Fade out and remove old image (if any)
    const oldImg = box.querySelector('img');
    if (oldImg) {
      oldImg.style.transition = 'opacity 0.4s ease';
      oldImg.style.opacity = '0';
      setTimeout(() => {
        oldImg.remove();
      }, 400);
    }

    // Draw canvas
    const canvasEl = document.createElement('canvas');
    canvasEl.width = img.naturalWidth;
    canvasEl.height = img.naturalHeight;
    const ctx = canvasEl.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Create and fade in new image
    const resultImg = new Image();
    resultImg.src = canvasEl.toDataURL();
    Object.assign(resultImg.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',
      height: 'auto',
      pointerEvents: 'none',
      userSelect: 'none',
      filter: 'drop-shadow(4px 4px 12px rgba(0,0,0,0.9))',
      opacity: '0',
      transition: 'opacity 0.4s ease'
    });

    box.appendChild(resultImg);

    // Trigger fade-in
    requestAnimationFrame(() => {
      resultImg.style.opacity = '1';
    });
  };
}

  box.addEventListener('mousedown', function () {
    if (inPreviewMode) return;
    document.querySelectorAll('.selectable[data-isCanvasBox]').forEach(el => el.classList.remove('selected'));
    removeResizeHandles();
    box.classList.add('selected');
    selectedElement = box;
    setTimeout(() => addResizeHandles(box), 0);
  });

  if (!document.getElementById('selectable-style')) {
    const style = document.createElement('style');
    style.id = 'selectable-style';
    style.textContent = `.selectable.selected { outline: 2px dashed #007090; }`;
    document.head.appendChild(style);
  }

canvas.appendChild(box);
if (type === 'container') {
  box.addEventListener('dblclick', () => {
    if (document.getElementById('container-popup')) return;

    const popup = document.createElement('div');
    popup.id = 'container-popup';
    Object.assign(popup.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#00d9f8',
      padding: '30px 40px',
      borderRadius: '28px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      zIndex: 2000,
      fontFamily: 'Segoe UI, sans-serif'
    });

    const title = document.createElement('div');
    title.textContent = 'Container Editor';
    Object.assign(title.style, {
      fontWeight: 'bold',
      fontSize: '20px',
      color: 'white'
    });

    const close = document.createElement('div');
    close.textContent = 'x';
    Object.assign(close.style, {
      position: 'absolute',
      top: '10px',
      right: '16px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer'
    });
    close.onclick = () => popup.remove();

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '30px';

    const createButton = (label) => {
      const btn = document.createElement('div');
      btn.textContent = label;
      Object.assign(btn.style, {
        background: '#009ecf',
        padding: '12px 22px',
        borderRadius: '18px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer'
      });
      return btn;
    };

    const textboxBtn = createButton('Textbox');
textboxBtn.onclick = () => {
  // Close container editor first (if open)
const existingContainerEditor = document.getElementById('container-popup');
if (existingContainerEditor) existingContainerEditor.remove();

// Then continue ONLY if textbox popup isn't already open
if (document.getElementById('container-textbox-popup')) return;
  const config = pages[currentPage]?.meta?.textboxConfig || {};
if (!config.assignedNames) config.assignedNames = [];
if (!config.columns) config.columns = 3;

  const popup = document.createElement('div');
  popup.id = 'container-textbox-popup';
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#00cfee',
    padding: '30px 40px',
    borderRadius: '30px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    fontFamily: 'Segoe UI, sans-serif',
    zIndex: 2000,
    maxWidth: '90vw'
  });

  const title = document.createElement('div');
  title.textContent = 'Textbox and Configuration';
  Object.assign(title.style, {
    fontWeight: 'bold',
    fontSize: '22px',
    color: 'white'
  });

  const subheading = document.createElement('div');
  subheading.textContent = 'Assigned Images';
  subheading.style.color = 'white';
  subheading.style.fontSize = '15px';

  const close = document.createElement('div');
  close.textContent = 'x';
  Object.assign(close.style, {
    position: 'absolute',
    top: '12px',
    right: '20px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
    cursor: 'pointer'
  });
  close.onclick = () => popup.remove();

  // Row: Columns & Align buttons
  const layoutRow = document.createElement('div');
  layoutRow.style.display = 'flex';
  layoutRow.style.gap = '14px';
  layoutRow.style.alignItems = 'center';

  const colLabel = document.createElement('div');
  colLabel.textContent = 'Number of Columns';
  colLabel.style.color = 'white';
  colLabel.style.fontSize = '14px';

  const colSelect = document.createElement('select');
  colSelect.style.borderRadius = '12px';
  colSelect.style.border = 'none';
  colSelect.style.padding = '6px 8px';
const currentCols = config.columns || 3;
for (let i = 1; i <= 10; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i;
  if (i === currentCols) option.selected = true;
  colSelect.appendChild(option);
}

  layoutRow.appendChild(colLabel);
  layoutRow.appendChild(colSelect);
  
  colSelect.onchange = () => {
  config.columns = parseInt(colSelect.value);
  pages[currentPage].meta.textboxConfig = config;

  const container = document.querySelector('.selectable[data-box-type="container"]');
  if (container) relayoutAssignedTextboxes(container, config);
};


  // Config & Text buttons
  const bottomRow = document.createElement('div');
  bottomRow.style.display = 'flex';
  bottomRow.style.gap = '20px';

  const configBtn = document.createElement('div');
configBtn.textContent = 'Textbox Config';
Object.assign(configBtn.style, {
  background: '#007fa3',
  padding: '10px 20px',
  borderRadius: '20px',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
});

configBtn.onclick = () => {
  const container = document.querySelector('.selectable[data-box-type="container"]');
  if (!container) return alert('No container found');

  const textboxes = [...document.querySelectorAll('.textbox-item[data-container-id="' + container.id + '"]')];
  if (textboxes.length === 0) return alert('No textboxes found inside the container');

  const config = pages[currentPage]?.meta?.textboxConfig || {};

  // Open config editor for just one textbox, but store and reapply to all others
  openTextboxConfig(config, null, textboxes[0], (updatedConfig) => {
    // Apply changes to all textboxes
    textboxes.forEach(tb => {
      tb.style.borderRadius = `${updatedConfig.textboxStyles?.radius || 0}px`;
      tb.style.backgroundColor = updatedConfig.textboxStyles?.boxColor || '#008fb8';
      tb.style.boxShadow = `0 0 ${updatedConfig.textboxStyles?.glow || 0}px ${updatedConfig.textboxStyles?.boxColor || '#008fb8'}`;
      tb.style.opacity = `${1 - ((updatedConfig.textboxStyles?.transparency || 0) / 100)}`;
      tb.style.borderWidth = `${updatedConfig.textboxStyles?.borderSize || 0}px`;
      tb.style.borderColor = updatedConfig.textboxStyles?.borderColor || '#000';
      tb.style.borderStyle = 'solid';

      if (updatedConfig.textboxStyles?.bgImage && updatedConfig.textboxStyles?.replaceBoxWithImage) {
        tb.style.backgroundImage = `url(${updatedConfig.textboxStyles.bgImage})`;
        tb.style.backgroundSize = '100% 100%';
        tb.style.backgroundRepeat = 'no-repeat';
        tb.style.backgroundColor = 'transparent';
        tb.style.border = 'none';
        tb.style.boxShadow = 'none';
      } else if (updatedConfig.textboxStyles?.bgImage) {
        tb.style.backgroundImage = `url(${updatedConfig.textboxStyles.bgImage})`;
        tb.style.backgroundSize = 'cover';
        tb.style.backgroundPosition = 'center';
        tb.style.backgroundRepeat = 'no-repeat';
      } else {
        tb.style.backgroundImage = '';
      }
    });

    relayoutAssignedTextboxes(container, config);
  });
};

const textBtn = document.createElement('div');
textBtn.textContent = 'Text';
Object.assign(textBtn.style, {
  background: '#007fa3',
  padding: '10px 20px',
  borderRadius: '20px',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer'
});

textBtn.onclick = () => {
  const container = document.querySelector('.selectable[data-box-type="container"]');
  if (!container) return alert('No container found');

  const targetTextbox = document.querySelector(`.textbox-item[data-container-id="${container.id}"]`);
  if (!targetTextbox) return alert('No textbox inside this container');

  const config = pages[currentPage]?.meta?.textboxConfig || {};
  openTextConfig(config, null, targetTextbox);
};
  bottomRow.appendChild(configBtn);
  bottomRow.appendChild(textBtn);

  popup.appendChild(title);
  popup.appendChild(subheading);
 const assignedContainer = document.createElement('div');
  Object.assign(assignedContainer.style, {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '10px',
    maxHeight: '120px', // ≈ 4 rows
    overflowY: 'auto',
    padding: '6px 10px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    width: '100%'
  });
  popup.appendChild(assignedContainer);


if (!config.assignedNames) config.assignedNames = [];

const assignedImages = [...document.querySelectorAll('img')]
  .map(img => img.dataset.name)
  .filter(Boolean);

assignedImages.forEach(name => {
  const row = document.createElement('label');
  row.style.display = 'flex';
  row.style.alignItems = 'center';
  row.style.gap = '10px';
  row.style.color = 'white';
  row.style.fontSize = '14px';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = config.assignedNames.includes(name);
checkbox.onchange = () => {
  const container = document.querySelector('.selectable[data-box-type="container"]');

  if (checkbox.checked) {
    if (!config.assignedNames.includes(name)) {
      config.assignedNames.push(name);

      setTimeout(() => {
        const before = [...document.querySelectorAll('.textbox-item')];
        spawnCanvasBox('textbox');
        setTimeout(() => {
          const after = [...document.querySelectorAll('.textbox-item')];
          const newTextbox = after.find(el => !before.includes(el));
          if (newTextbox && container) {
  newTextbox.setAttribute('data-linkedName', name);
  newTextbox.textContent = name;
  newTextbox.dataset.containerId = container.id;

            const boxRect = newTextbox.getBoundingClientRect();
            newTextbox.style.width = `${boxRect.width}px`;
            newTextbox.style.height = `${boxRect.height}px`;
            newTextbox.style.position = 'absolute';
            const canvas = document.getElementById('actual-canvas');

            canvas.appendChild(newTextbox);
            relayoutAssignedTextboxes(container, config);
          }
        }, 0);
      }, 0);
    }
  } else {
    config.assignedNames = config.assignedNames.filter(n => n !== name);
const removedBox = [...document.querySelectorAll('.textbox-item')]
  .find(el => el.dataset.linkedname === name);
if (removedBox) {
  removedBox.remove();
  const pageList = pages[currentPage];
  const index = pageList.indexOf(removedBox);
  if (index !== -1) pageList.splice(index, 1);
}
    if (container) relayoutAssignedTextboxes(container, config);
  }

  pages[currentPage].meta.textboxConfig = config;
};

  const labelText = document.createElement('span');
  labelText.textContent = name;

  row.appendChild(checkbox);
  row.appendChild(labelText);
  assignedContainer.appendChild(row);
});
  popup.appendChild(layoutRow);
  popup.appendChild(bottomRow);
  popup.appendChild(close);

  document.body.appendChild(popup);
};
    const boxBtn = createButton('Box');
boxBtn.onclick = () => {
  // Close container editor first (if open)
  const existingContainerEditor = document.getElementById('container-popup');
  if (existingContainerEditor) existingContainerEditor.remove();

  const config = pages[currentPage]?.meta?.textboxConfig || {};
  openTextboxConfig(config, null, box);
};

    row.appendChild(textboxBtn);
    row.appendChild(boxBtn);

    popup.appendChild(title);
    popup.appendChild(close);
    popup.appendChild(row);
    document.body.appendChild(popup);
  });
}
if (type === 'imagePreview') {
  box.addEventListener('dblclick', () => {
    if (document.getElementById('image-preview-popup')) return;

    const popup = document.createElement('div');
    popup.id = 'image-preview-popup';
    Object.assign(popup.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#00d9f8',
      padding: '30px 40px',
      borderRadius: '28px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      zIndex: 2000,
      fontFamily: 'Segoe UI, sans-serif'
    });

    const title = document.createElement('div');
    title.textContent = 'Image Preview Editor';
    Object.assign(title.style, {
      fontWeight: 'bold',
      fontSize: '20px',
      color: 'white'
    });

    const close = document.createElement('div');
    close.textContent = 'x';
    Object.assign(close.style, {
      position: 'absolute',
      top: '10px',
      right: '16px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer'
    });
    close.onclick = () => popup.remove();

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '30px';

    const createButton = (label) => {
      const btn = document.createElement('div');
      btn.textContent = label;
      Object.assign(btn.style, {
        background: '#009ecf',
        padding: '12px 22px',
        borderRadius: '18px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer'
      });
      return btn;
    };

    const boxBtn = createButton('Box');
    boxBtn.onclick = () => {
  const config = pages[currentPage]?.meta?.textboxConfig || {};
  openTextboxConfig(config, null, box);
};
    const imageBtn = createButton('Image');

    row.appendChild(boxBtn);
    row.appendChild(imageBtn);

    popup.appendChild(title);
    popup.appendChild(close);
    popup.appendChild(row);
    document.body.appendChild(popup);
  });
}
if (!pages[currentPage]) pages[currentPage] = [];
pages[currentPage].push(box);

// ✅ Double-click to open the Container Editor (only for box type)
if (type === 'box') {
  box.addEventListener('dblclick', () => {
    if (document.getElementById('container-config-popup')) return;

    const popup = document.createElement('div');
    popup.id = 'container-config-popup';
    Object.assign(popup.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#00d9f8',
      padding: '30px 40px',
      borderRadius: '28px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
      zIndex: 2000,
      fontFamily: 'Segoe UI, sans-serif'
    });

    const title = document.createElement('div');
    title.textContent = 'Container Editor';
    Object.assign(title.style, {
      fontWeight: 'bold',
      fontSize: '20px',
      color: 'white'
    });

    const close = document.createElement('div');
    close.textContent = 'x';
    Object.assign(close.style, {
      position: 'absolute',
      top: '10px',
      right: '16px',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer'
    });
    close.onclick = () => popup.remove();

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '30px';

    const createButton = (label) => {
      const btn = document.createElement('div');
      btn.textContent = label;
      Object.assign(btn.style, {
        background: '#009ecf',
        padding: '12px 22px',
        borderRadius: '18px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer'
      });
      return btn;
    };

    const textboxBtn = createButton('Textbox');
    const boxBtn = createButton('Box');

    row.appendChild(textboxBtn);
    row.appendChild(boxBtn);

    popup.appendChild(title);
    popup.appendChild(close);
    popup.appendChild(row);
    document.body.appendChild(popup);
  });
}
}
function openTextboxEditorGUI(targetTextbox) {
  const existing = document.getElementById('textbox-editor-popup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.id = 'textbox-editor-popup';
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#00cfee',
    padding: '30px',
    borderRadius: '28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    fontFamily: 'Segoe UI, sans-serif',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    zIndex: 2000,
    width: '320px'
  });

  const title = document.createElement('div');
  title.textContent = 'Box Editor';
  title.style.fontSize = '22px';
  title.style.fontWeight = 'bold';
  title.style.color = 'white';
  popup.appendChild(title);

  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.justifyContent = 'space-between';
  btnRow.style.width = '100%';
  btnRow.style.gap = '12px';

  const textBtn = document.createElement('button');
  textBtn.textContent = 'Text';
  Object.assign(textBtn.style, {
    flex: 1,
    padding: '10px',
    fontSize: '15px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#0097b2',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
  });
  textBtn.onclick = () => openTextConfig({}, {}, targetTextbox);

  const boxBtn = document.createElement('button');
  boxBtn.textContent = 'Box';
  Object.assign(boxBtn.style, {
    flex: 1,
    padding: '10px',
    fontSize: '15px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#0097b2',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
  });
  boxBtn.onclick = () => {
    const config = pages[currentPage]?.meta?.textboxConfig || {};
    openTextboxConfig(config, {}, targetTextbox);
  };

  const hoverBtn = document.createElement('button');
  hoverBtn.textContent = 'Hover/Click Effects';
  Object.assign(hoverBtn.style, {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#0097b2',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
  });
  hoverBtn.onclick = () => openHoverClickEffectsPopup(targetTextbox);

  btnRow.appendChild(textBtn);
  btnRow.appendChild(boxBtn);
  btnRow.appendChild(hoverBtn);
  popup.appendChild(btnRow);

  const labelRow = document.createElement('div');
  Object.assign(labelRow.style, {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#0097b2',
    borderRadius: '14px',
    padding: '8px 12px',
    width: '100%',
    color: 'white'
  });

  const label = document.createElement('span');
  label.textContent = 'Custom Text:';
  Object.assign(label.style, { flex: 1 });

  const input = document.createElement('input');
  input.type = 'text';
  input.value = targetTextbox.textContent;
  Object.assign(input.style, {
    flex: 1,
    padding: '6px',
    borderRadius: '14px',
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontWeight: 'bold',
    marginLeft: '8px',
    maxWidth: '160px'
  });

  input.oninput = () => {
    targetTextbox.innerHTML = '';
    targetTextbox.appendChild(document.createTextNode(input.value));
  };

  labelRow.appendChild(label);
  labelRow.appendChild(input);
  popup.appendChild(labelRow);

  const assignedLabel = document.createElement('div');
  assignedLabel.textContent = 'Assigned Image';
  assignedLabel.style.color = 'white';
  assignedLabel.style.fontWeight = 'bold';
  popup.appendChild(assignedLabel);

  const dropdown = document.createElement('select');
  Object.assign(dropdown.style, {
    padding: '6px',
    borderRadius: '8px',
    width: '100%',
    fontSize: '14px',
    fontWeight: 'bold'
  });

  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = 'None';
  dropdown.appendChild(emptyOption);

  const imagePool = (pages[currentPage]?.meta?.namedImages || []).map(obj => obj.name);
  imagePool.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    dropdown.appendChild(option);
  });

  // Set dropdown to current selection if any
  const currentLinkedName = targetTextbox.getAttribute('data-linkedname') || '';
  dropdown.value = imagePool.includes(currentLinkedName) ? currentLinkedName : '';

  dropdown.onchange = () => {
  const selected = dropdown.value.trim();
  const config = pages[currentPage]?.meta?.textboxConfig || {};
  const oldLinked = targetTextbox.getAttribute('data-linkedname');

  // 🧼 Remove the old assigned name if it exists
  if (oldLinked) {
    config.assignedNames = (config.assignedNames || []).filter(n => n !== oldLinked);
  }

  if (selected) {
    targetTextbox.classList.add('textbox-item');
    targetTextbox.setAttribute('data-linkedname', selected);
    targetTextbox.innerHTML = '';
    targetTextbox.appendChild(document.createTextNode(selected));

    config.assignedNames = Array.from(new Set([...(config.assignedNames || []), selected]));
    pages[currentPage].meta.textboxConfig = config;
  } else {
    targetTextbox.classList.remove('textbox-item');
    targetTextbox.removeAttribute('data-linkedname');
    targetTextbox.innerHTML = '';
    targetTextbox.appendChild(document.createTextNode('Textbox'));
  }
};

  popup.appendChild(dropdown);
  
  const eventBtn = document.createElement('button');
eventBtn.textContent = 'Event Listeners';
Object.assign(eventBtn.style, {
  width: '100%',
  padding: '10px',
  fontSize: '15px',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: '#0097b2',
  border: 'none',
  borderRadius: '14px',
  cursor: 'pointer',
  boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
});
popup.appendChild(eventBtn);

eventBtn.onclick = () => {
  openEventListenerPopup();
};

  const bottomRow = document.createElement('div');
  bottomRow.style.display = 'flex';
  bottomRow.style.gap = '12px';
  bottomRow.style.marginTop = '10px';

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.style.background = '#0097b2';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Close';
  cancelBtn.style.background = 'gray';

  [resetBtn, cancelBtn].forEach(btn => {
    Object.assign(btn.style, {
      padding: '6px 14px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      fontSize: '13px',
    });
  });

  resetBtn.onclick = () => {
    input.value = '';
    targetTextbox.textContent = '';
  };

  cancelBtn.onclick = () => popup.remove();

  bottomRow.appendChild(resetBtn);
  bottomRow.appendChild(cancelBtn);
  popup.appendChild(bottomRow);

  document.body.appendChild(popup);
}
function openTextConfig(config, inputs, targetTextbox) {
  if (document.getElementById('text-config-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'text-config-popup';
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#00cfee',
    padding: '18px 20px',
    borderRadius: '20px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'Segoe UI, sans-serif',
    zIndex: 2000,
  });

  const label = document.createElement('div');
  label.textContent = 'Text Editor';
  label.style.color = 'white';
  label.style.fontSize = '16px';
  label.style.fontWeight = 'bold';
  popup.appendChild(label);

  const closeBtn = document.createElement('div');
  closeBtn.textContent = '✕';
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '8px',
    right: '12px',
    fontSize: '18px',
    color: 'white',
    cursor: 'pointer'
  });
  closeBtn.onclick = () => popup.remove();
  popup.appendChild(closeBtn);

  const row = document.createElement('div');
  Object.assign(row.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  });

  // Font selector
  const fontSelect = document.createElement('select');
  [
  'Arial',
  'Georgia',
  'Verdana',
  'Courier New',
  'Times New Roman',
  'Stranger Things',
  'Stranger Things Outlined',
  'The Last of Us',
  'The Last of Us Extreme',
  'The Last of Us Rough',
  'Waltograph',
  'Minecraft',
  'Indiana Jones',
  'Jurassic Park',
  'Lazarrous',
  'Blood & Horror',
  'Puzzled',
  'Vintage',
  'Harry Potter',
  'Death Star',
  'Cartoon Marker',
  'Goblin Hand Bold',
  'Goblin Hand Italic',
  'Goblin Hand Regular',
  'Goblin Hand Small Caps',
  'Lost Fish',
  'Didot Bold',
  'Marker'
].forEach(f => {
    const opt = document.createElement('option');
    opt.value = f;
    opt.textContent = f;
    opt.style.fontFamily = `${f}, sans-serif`;
    fontSelect.appendChild(opt);
  });

// Set the dropdown to match current font
const currentFont = window.getComputedStyle(targetTextbox).fontFamily;
const match = Array.from(fontSelect.options).find(opt =>
  currentFont.toLowerCase().includes(opt.value.toLowerCase())
);
if (match) fontSelect.value = match.value;

fontSelect.oninput = () => {
  targetTextbox.style.fontFamily = `${fontSelect.value}, sans-serif`;
};

  Object.assign(fontSelect.style, {
    padding: '6px 12px',
    borderRadius: '12px',
    border: 'none',
    fontWeight: 'bold',
    background: '#009ecf',
    color: 'white'
  });
  row.appendChild(fontSelect);

  // Font size
  const sizeInput = document.createElement('input');
  sizeInput.type = 'number';
  sizeInput.min = 10;
  sizeInput.max = 60;
  sizeInput.value = parseInt(window.getComputedStyle(targetTextbox).fontSize) || 18;
  Object.assign(sizeInput.style, {
    width: '60px',
    padding: '6px',
    borderRadius: '12px',
    border: 'none',
    background: '#009ecf',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  });
  sizeInput.oninput = () => {
  targetTextbox.style.fontSize = sizeInput.value + 'px';
};
  row.appendChild(sizeInput);

// Color
const colorInput = document.createElement('input');
colorInput.type = 'color';

// Use computed style so the current color actually reflects on load
const computedColor = window.getComputedStyle(targetTextbox).color;
const toHex = (rgb) => {
  const result = rgb.match(/\d+/g).map(n => parseInt(n).toString(16).padStart(2, '0'));
  return `#${result.slice(0, 3).join('')}`;
};
colorInput.value = toHex(computedColor);

Object.assign(colorInput.style, {
  width: '40px',
  height: '32px',
  padding: '0',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
});
colorInput.oninput = () => {
  targetTextbox.style.color = colorInput.value;
};

row.appendChild(colorInput);

// Style toggles (persistent)
const makeToggle = (label, cssProp, cssValue) => {
  const btn = document.createElement('button');
  btn.textContent = label;
  Object.assign(btn.style, {
    padding: '6px 10px',
    borderRadius: '8px',
    background: '#009ecf',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
  });

  // Initialize button state from current textbox style
  let active = (targetTextbox.style[cssProp] === cssValue);
  if (active) btn.style.background = '#005f7a';

  btn.onclick = () => {
    active = !active;
    btn.style.background = active ? '#005f7a' : '#009ecf';
    targetTextbox.style[cssProp] = active ? cssValue : 'initial';
  };

  return btn;
};

row.appendChild(makeToggle('B', 'fontWeight', 'bold'));
row.appendChild(makeToggle('/', 'fontStyle', 'italic'));
row.appendChild(makeToggle('U', 'textDecoration', 'underline'));

  popup.appendChild(row);
// ACTION ROW FOR BUTTONS
const actionRow = document.createElement('div');
Object.assign(actionRow.style, {
  display: 'flex',
  gap: '10px',
  marginTop: '10px',
});

// Track copied config
let copiedTextStyleConfig = null;

// Helper to make styled action buttons
const makeActionButton = (label, handler) => {
  const btn = document.createElement('button');
  btn.textContent = label;
  Object.assign(btn.style, {
    padding: '8px 14px',
    borderRadius: '12px',
    background: '#005f7a',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer'
  });
  btn.onclick = handler;
  return btn;
};

// Push to All
actionRow.appendChild(makeActionButton('Push to All', () => {
  const allTextboxes = document.querySelectorAll('.textbox-item');
  allTextboxes.forEach(tb => {
    tb.style.fontFamily = fontSelect.value + ', sans-serif';
    tb.style.fontSize = sizeInput.value + 'px';
    tb.style.color = colorInput.value;
    tb.style.fontWeight = targetTextbox.style.fontWeight;
    tb.style.fontStyle = targetTextbox.style.fontStyle;
    tb.style.textDecoration = targetTextbox.style.textDecoration;
  });
  popup.remove();
}));

// Push to Assigned Images
actionRow.appendChild(makeActionButton('Push to Assigned Images', () => {
  const config = pages[currentPage]?.meta?.textboxConfig || {};
  const assigned = config.assignedNames || [];
  const boxes = document.querySelectorAll('.textbox-item');
  boxes.forEach(tb => {
    if (assigned.includes(tb.dataset.linkedname)) {
      tb.style.fontFamily = fontSelect.value + ', sans-serif';
      tb.style.fontSize = sizeInput.value + 'px';
      tb.style.color = colorInput.value;
      tb.style.fontWeight = targetTextbox.style.fontWeight;
      tb.style.fontStyle = targetTextbox.style.fontStyle;
      tb.style.textDecoration = targetTextbox.style.textDecoration;
    }
  });
  popup.remove();
}));

// Copy Layout
actionRow.appendChild(makeActionButton('Copy Layout', () => {
  copiedTextStyleConfig = {
    fontFamily: fontSelect.value,
    fontSize: sizeInput.value,
    color: colorInput.value,
    fontWeight: targetTextbox.style.fontWeight,
    fontStyle: targetTextbox.style.fontStyle,
    textDecoration: targetTextbox.style.textDecoration
  };
  alert("Text style copied!");
}));

// Paste Layout
actionRow.appendChild(makeActionButton('Paste Layout', () => {
  if (!copiedTextStyleConfig) return;

  // Update inputs
  fontSelect.value = copiedTextStyleConfig.fontFamily;
  fontSelect.oninput();
  sizeInput.value = copiedTextStyleConfig.fontSize;
  sizeInput.oninput();
  colorInput.value = copiedTextStyleConfig.color;
  colorInput.oninput();

  // Apply styles directly to the textbox
  targetTextbox.style.fontFamily = copiedTextStyleConfig.fontFamily + ', sans-serif';
  targetTextbox.style.fontSize = copiedTextStyleConfig.fontSize + 'px';
  targetTextbox.style.color = copiedTextStyleConfig.color;
  targetTextbox.style.fontWeight = copiedTextStyleConfig.fontWeight || 'initial';
  targetTextbox.style.fontStyle = copiedTextStyleConfig.fontStyle || 'initial';
  targetTextbox.style.textDecoration = copiedTextStyleConfig.textDecoration || 'initial';

  // Update toggle visuals
  row.querySelectorAll('button').forEach(btn => {
    const type = btn.textContent;
    if (type === 'B') {
      btn.style.background = (copiedTextStyleConfig.fontWeight === 'bold') ? '#005f7a' : '#009ecf';
    } else if (type === '/') {
      btn.style.background = (copiedTextStyleConfig.fontStyle === 'italic') ? '#005f7a' : '#009ecf';
    } else if (type === 'U') {
      btn.style.background = (copiedTextStyleConfig.textDecoration?.includes('underline')) ? '#005f7a' : '#009ecf';
    }
  });
}));

popup.appendChild(actionRow);

  document.body.appendChild(popup);
}
function openTextboxConfig(config, inputs, targetTextbox) {
  if (document.getElementById('textbox-config-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'textbox-config-popup';
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#00cfee',
    padding: '18px 20px',
    borderRadius: '20px',
    boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    fontFamily: 'Segoe UI, sans-serif',
    zIndex: 2000,
    maxHeight: '90vh',
    overflowY: 'auto',
  });

  const label = document.createElement('div');
  label.textContent = 'Box Editor';
  label.style.color = 'white';
  label.style.fontSize = '15px';
  label.style.fontWeight = 'bold';
  popup.appendChild(label);

  const row = document.createElement('div');
  Object.assign(row.style, {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center'
  });

  const styleMiniInput = (input, labelText, onChange) => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '4px';
    const label = document.createElement('span');
    label.textContent = labelText;
    label.style.color = 'white';
    label.style.fontSize = '13px';
    label.style.fontWeight = 'bold';
    wrap.appendChild(label);
    Object.assign(input.style, {
      width: '50px',
      padding: '4px',
      borderRadius: '8px',
      border: 'none',
      textAlign: 'center',
      background: '#009ecf',
      color: 'white',
      fontWeight: 'bold'
    });
    if (onChange) input.oninput = onChange;
    wrap.appendChild(input);
    row.appendChild(wrap);
    return input;
  };

  const glow = styleMiniInput(document.createElement('input'), "Glow", () => {
    targetTextbox.style.boxShadow = `0 0 ${glow.value}px ${boxColor.value}`;
  });
  glow.type = 'number';
  glow.min = 0;
  glow.max = 20;
const computedShadow = window.getComputedStyle(targetTextbox).boxShadow;
const glowValue = computedShadow.match(/\d+px/g);
glow.value = glowValue && glowValue[2] ? parseInt(glowValue[2]) : (config.textboxStyles?.glow || 0);

  const round = styleMiniInput(document.createElement('input'), "Roundness", () => {
    targetTextbox.style.borderRadius = `${round.value}px`;
  });
  round.type = 'number';
  round.min = 0;
  round.max = 30;
const computedRadius = window.getComputedStyle(targetTextbox).borderRadius;
round.value = parseInt(computedRadius) || config.textboxStyles?.radius || 10;

  const trans = styleMiniInput(document.createElement('input'), "Transparency", () => {
    targetTextbox.style.opacity = `${(100 - parseInt(trans.value)) / 100}`;
  });
  trans.type = 'number';
  trans.min = 0;
  trans.max = 100;
  const computedOpacity = window.getComputedStyle(targetTextbox).opacity;
trans.value = Math.round((1 - parseFloat(computedOpacity)) * 100) || config.textboxStyles?.transparency || 0;

  const boxColor = document.createElement('input');
  boxColor.type = 'color';
  const computedBoxColor = window.getComputedStyle(targetTextbox).backgroundColor;
const toHex = (rgb) => {
  const result = rgb.match(/\d+/g);
  if (!result || result.length < 3) return '#008fb8';
  return '#' + result.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
};
boxColor.value = toHex(computedBoxColor) || config.textboxStyles?.boxColor || '#008fb8';
  Object.assign(boxColor.style, {
    width: '40px',
    height: '30px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  });
  boxColor.oninput = () => {
  targetTextbox.style.backgroundColor = boxColor.value;
  targetTextbox.style.boxShadow = `0 0 ${glow.value}px ${boxColor.value}`;
  config.textboxStyles = config.textboxStyles || {};
  config.textboxStyles.boxColor = boxColor.value;
};
  row.appendChild(boxColor);

  popup.appendChild(row);

  const borderLabel = document.createElement('div');
  borderLabel.textContent = 'Box Border';
  borderLabel.style.color = 'white';
  borderLabel.style.fontWeight = 'bold';
  popup.appendChild(borderLabel);

  const borderRow = document.createElement('div');
  borderRow.style.display = 'flex';
  borderRow.style.gap = '10px';
  borderRow.style.alignItems = 'center';

  const borderSize = document.createElement('input');
  borderSize.type = 'number';
  borderSize.min = 0;
  borderSize.max = 30;
  const computedBorderWidth = window.getComputedStyle(targetTextbox).borderWidth;
borderSize.value = parseInt(computedBorderWidth) || config.textboxStyles?.borderSize || 0;
  borderSize.oninput = () => {
    targetTextbox.style.borderWidth = `${borderSize.value}px`;
    targetTextbox.style.borderStyle = 'solid';
  };

  const sizeWrap = document.createElement('div');
  sizeWrap.style.display = 'flex';
  sizeWrap.style.alignItems = 'center';
  sizeWrap.style.gap = '6px';

  const sizeLabel = document.createElement('span');
  sizeLabel.textContent = "Size";
  sizeLabel.style.color = 'white';
  sizeLabel.style.fontWeight = 'bold';
  sizeLabel.style.fontSize = '13px';

  Object.assign(borderSize.style, {
    width: '50px',
    padding: '4px',
    borderRadius: '8px',
    border: 'none',
    textAlign: 'center',
    background: '#009ecf',
    color: 'white',
    fontWeight: 'bold'
  });

  sizeWrap.appendChild(sizeLabel);
  sizeWrap.appendChild(borderSize);
  borderRow.appendChild(sizeWrap);

  const borderColor = document.createElement('input');
  borderColor.type = 'color';
  borderColor.value = config.textboxStyles?.borderColor || '#000000';
  borderColor.oninput = () => {
    targetTextbox.style.borderColor = borderColor.value;
  };
  Object.assign(borderColor.style, {
    width: '40px',
    height: '30px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  });
  borderRow.appendChild(borderColor);
  popup.appendChild(borderRow);

// --- Add Upload Image row here ---
const uploadRow = document.createElement('div');
uploadRow.style.display = 'flex';
uploadRow.style.alignItems = 'center';
uploadRow.style.gap = '10px';
uploadRow.style.background = '#009ecf';
uploadRow.style.borderRadius = '14px';
uploadRow.style.padding = '6px 12px';
uploadRow.style.marginTop = '12px';
uploadRow.style.width = '260px';

const uploadLabel = document.createElement('span');
uploadLabel.textContent = 'Upload Background:';
uploadLabel.style.color = 'white';
uploadLabel.style.fontWeight = 'bold';
uploadLabel.style.fontSize = '14px';

const uploadInput = document.createElement('input');
uploadInput.type = 'file';
uploadInput.accept = 'image/*';
uploadInput.style.display = 'none';

const fileNameDisplay = document.createElement('div');
fileNameDisplay.style.flex = '1';
fileNameDisplay.style.height = '30px';
fileNameDisplay.style.background = 'white';
fileNameDisplay.style.borderRadius = '14px';
fileNameDisplay.style.color = 'black';
fileNameDisplay.style.display = 'flex';
fileNameDisplay.style.alignItems = 'center';
fileNameDisplay.style.padding = '0 10px';
fileNameDisplay.style.overflow = 'hidden';
fileNameDisplay.style.whiteSpace = 'nowrap';
fileNameDisplay.style.textOverflow = 'ellipsis';
fileNameDisplay.textContent = config.textboxStyles?.bgImageName || '';

uploadInput.addEventListener('change', () => {
  const file = uploadInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;

      // Set image as background of the textbox
      targetTextbox.style.backgroundImage = `url(${imageUrl})`;
      targetTextbox.style.backgroundSize = 'cover';
      targetTextbox.style.backgroundPosition = 'center';
      targetTextbox.style.backgroundRepeat = 'no-repeat';

      // Save to config
      config.textboxStyles = config.textboxStyles || {};
      config.textboxStyles.bgImage = imageUrl;
      config.textboxStyles.bgImageName = file.name;

      fileNameDisplay.textContent = file.name;
    };
    reader.readAsDataURL(file);
  } else {
    // Clear image
    targetTextbox.style.backgroundImage = '';
    fileNameDisplay.textContent = '';
    if (config.textboxStyles) {
      delete config.textboxStyles.bgImage;
      delete config.textboxStyles.bgImageName;
    }
  }
});

fileNameDisplay.style.cursor = 'pointer';
fileNameDisplay.onclick = () => uploadInput.click();

uploadRow.appendChild(uploadLabel);
uploadRow.appendChild(fileNameDisplay);
uploadRow.appendChild(uploadInput);
popup.appendChild(uploadRow);

// Separate row for Clear + Replace Box
const controlRow = document.createElement('div');
controlRow.style.display = 'flex';
controlRow.style.alignItems = 'center';
controlRow.style.gap = '12px';
controlRow.style.marginTop = '10px';

// Clear Button
const clearBtn = document.createElement('div');
clearBtn.textContent = 'Clear';
Object.assign(clearBtn.style, {
  background: '#009ecf',
  color: 'white',
  borderRadius: '10px',
  padding: '6px 10px',
  fontWeight: 'bold',
  cursor: 'pointer'
});
clearBtn.onclick = () => {
  uploadInput.value = '';
  fileNameDisplay.textContent = '';
  
  // Remove background image from textbox
  targetTextbox.style.backgroundImage = '';
  
  // Clear saved config
  if (config.textboxStyles) {
    delete config.textboxStyles.bgImage;
    delete config.textboxStyles.bgImageName;
  }
};

// Replace Box Label + Checkbox
const replaceWrap = document.createElement('div');
replaceWrap.style.display = 'flex';
replaceWrap.style.alignItems = 'center';
replaceWrap.style.gap = '6px';

const replaceLabel = document.createElement('span');
replaceLabel.textContent = 'Replace Box:';
replaceLabel.style.color = 'white';
replaceLabel.style.fontWeight = 'bold';
replaceLabel.style.fontSize = '14px';

const replaceCheckbox = document.createElement('input');
replaceCheckbox.type = 'checkbox';
replaceCheckbox.checked = config.textboxStyles?.replaceBoxWithImage || false;
replaceCheckbox.onchange = () => {
  config.textboxStyles.replaceBoxWithImage = replaceCheckbox.checked;

  if (replaceCheckbox.checked && config.textboxStyles.bgImage) {
    const img = new Image();
    img.onload = () => {
      // Calculate the new textbox size to match the image aspect ratio
      const currentWidth = targetTextbox.offsetWidth;
      const aspectRatio = img.height / img.width;
      const newHeight = currentWidth * aspectRatio;

      targetTextbox.style.height = `${newHeight}px`;
      targetTextbox.style.backgroundImage = `url(${config.textboxStyles.bgImage})`;
      targetTextbox.style.backgroundSize = '100% 100%';
      targetTextbox.style.backgroundRepeat = 'no-repeat';
      targetTextbox.style.backgroundColor = 'transparent';
      targetTextbox.style.border = 'none';
      targetTextbox.style.boxShadow = 'none';
    };
    img.src = config.textboxStyles.bgImage;
  } else {
    // Revert to standard styling
    targetTextbox.style.backgroundImage = '';
    targetTextbox.style.backgroundColor = config.textboxStyles.boxColor || '#008fb8';
    targetTextbox.style.border = `${config.textboxStyles.borderSize || 0}px solid ${config.textboxStyles.borderColor || '#000'}`;
    targetTextbox.style.boxShadow = `0 0 ${config.textboxStyles.glow || 0}px ${config.textboxStyles.boxColor || '#008fb8'}`;
  }
};

replaceWrap.appendChild(replaceLabel);
replaceWrap.appendChild(replaceCheckbox);
controlRow.appendChild(clearBtn);
controlRow.appendChild(replaceWrap);

popup.appendChild(controlRow);

  const closeBtn = document.createElement('div');
  closeBtn.textContent = '✕';
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '8px',
    right: '12px',
    fontSize: '18px',
    color: 'white',
    cursor: 'pointer'
  });
  closeBtn.onclick = () => popup.remove();
  // ======= 4 Action Buttons =======
const actionRow = document.createElement('div');
actionRow.style.display = 'flex';
actionRow.style.flexWrap = 'wrap';
actionRow.style.justifyContent = 'center';
actionRow.style.gap = '10px';
actionRow.style.marginTop = '14px';

const makeActionButton = (label, handler) => {
  const btn = document.createElement('div');
  btn.textContent = label;
  Object.assign(btn.style, {
    background: '#007fa3',
    color: 'white',
    fontWeight: 'bold',
    padding: '8px 14px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '13px',
  });
  btn.onclick = handler;
  return btn;
};

actionRow.appendChild(makeActionButton('Push to All', () => {
  const boxes = document.querySelectorAll('.textbox-item');
  boxes.forEach(tb => applyTextboxStylesTo(tb));
popup.remove();
}));

actionRow.appendChild(makeActionButton('Push to Assigned Images', () => {
  const config = pages[currentPage]?.meta?.textboxConfig || {};
  const assigned = config.assignedNames || [];
  const boxes = document.querySelectorAll('.textbox-item');
  boxes.forEach(tb => {
    if (assigned.includes(tb.dataset.linkedname)) applyTextboxStylesTo(tb);
  });
  popup.remove(); // ✅ close GUI after push
}));

actionRow.appendChild(makeActionButton('Copy Layout', () => {
  copiedTextboxStyleConfig = {
    glow: glow.value,
    roundness: round.value,
    transparency: trans.value,
    borderSize: borderSize.value,
    borderColor: borderColor.value,
    boxColor: boxColor.value,
    bgImage: config.textboxStyles?.bgImage || '',
    bgImageName: config.textboxStyles?.bgImageName || '',
    replaceBoxWithImage: replaceCheckbox.checked
  };
}));

actionRow.appendChild(makeActionButton('Paste Layout', () => {
  if (!copiedTextboxStyleConfig) return;

glow.value = copiedTextboxStyleConfig.glow;
round.value = copiedTextboxStyleConfig.roundness;
trans.value = copiedTextboxStyleConfig.transparency;
borderSize.value = copiedTextboxStyleConfig.borderSize;
borderColor.value = copiedTextboxStyleConfig.borderColor;
boxColor.value = copiedTextboxStyleConfig.boxColor;
replaceCheckbox.checked = copiedTextboxStyleConfig.replaceBoxWithImage;

// 🔥 Call input handlers so styles AND config update:
glow.oninput();
round.oninput();
trans.oninput();
borderSize.oninput();
borderColor.oninput();
boxColor.oninput();
replaceCheckbox.dispatchEvent(new Event('change'));

  if (copiedTextboxStyleConfig.bgImage) {
    targetTextbox.style.backgroundImage = `url(${copiedTextboxStyleConfig.bgImage})`;
    targetTextbox.style.backgroundSize = 'cover';
    targetTextbox.style.backgroundPosition = 'center';
    targetTextbox.style.backgroundRepeat = 'no-repeat';
    config.textboxStyles.bgImage = copiedTextboxStyleConfig.bgImage;
    config.textboxStyles.bgImageName = copiedTextboxStyleConfig.bgImageName;
    fileNameDisplay.textContent = copiedTextboxStyleConfig.bgImageName;
  }
}));

popup.appendChild(actionRow);

// ======= Style Apply Function =======
function applyTextboxStylesTo(tb) {
  tb.style.borderRadius = `${round.value}px`;
  tb.style.boxShadow = `0 0 ${glow.value}px ${boxColor.value}`;
  tb.style.opacity = `${(100 - parseInt(trans.value)) / 100}`;
  tb.style.backgroundColor = boxColor.value;
  tb.style.borderWidth = `${borderSize.value}px`;
  tb.style.borderStyle = 'solid';
  tb.style.borderColor = borderColor.value;

  if (config.textboxStyles.bgImage && config.textboxStyles.replaceBoxWithImage) {
    tb.style.backgroundImage = `url(${config.textboxStyles.bgImage})`;
    tb.style.backgroundSize = '100% 100%';
    tb.style.backgroundRepeat = 'no-repeat';
    tb.style.backgroundColor = 'transparent';
    tb.style.border = 'none';
    tb.style.boxShadow = 'none';
  } else if (config.textboxStyles.bgImage) {
    tb.style.backgroundImage = `url(${config.textboxStyles.bgImage})`;
    tb.style.backgroundSize = 'cover';
    tb.style.backgroundPosition = 'center';
    tb.style.backgroundRepeat = 'no-repeat';
  } else {
    tb.style.backgroundImage = '';
  }
}
  popup.appendChild(closeBtn);

  document.body.appendChild(popup);
}
function openHoverClickEffectsPopup(targetTextbox) {
  if (document.getElementById('hover-click-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'hover-click-popup';
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#00cfee',
    padding: '30px',
    borderRadius: '28px',
    fontFamily: 'Segoe UI, sans-serif',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    zIndex: 3000,
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
  });

  const title = document.createElement('div');
  title.textContent = 'Hover/Click Effects';
  Object.assign(title.style, {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
  });
  popup.appendChild(title);

  // Hover dropdown
  const hoverLabel = document.createElement('div');
  hoverLabel.textContent = 'Hover Effects';
  hoverLabel.style.color = 'white';
  hoverLabel.style.fontWeight = 'bold';
  popup.appendChild(hoverLabel);

  const hoverSelect = document.createElement('select');
  ['None', 'Enlarge Textbox', 'Insert Shadow', 'Shade'].forEach(opt => {
  const o = document.createElement('option');
  o.value = opt;
  o.textContent = opt;
  if (targetTextbox.dataset.hoverEffect === opt) o.selected = true;
  hoverSelect.appendChild(o);
});
  Object.assign(hoverSelect.style, {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#0097b2',
    color: 'white',
    cursor: 'pointer',
  });
  popup.appendChild(hoverSelect);

  // Click dropdown
  const clickLabel = document.createElement('div');
  clickLabel.textContent = 'Click Effects';
  clickLabel.style.color = 'white';
  clickLabel.style.fontWeight = 'bold';
  popup.appendChild(clickLabel);

  const clickSelect = document.createElement('select');
  ['None', 'Minimize Textbox', 'Shade', 'Insert Shadow'].forEach(opt => {
  const o = document.createElement('option');
  o.value = opt;
  o.textContent = opt;
  if (targetTextbox.dataset.clickEffect === opt) o.selected = true;
  clickSelect.appendChild(o);
});
  Object.assign(clickSelect.style, {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#0097b2',
    color: 'white',
    cursor: 'pointer',
  });
  popup.appendChild(clickSelect);

  // Store effects in dataset
  hoverSelect.oninput = () => {
    targetTextbox.dataset.hoverEffect = hoverSelect.value;
  };
  clickSelect.oninput = () => {
    targetTextbox.dataset.clickEffect = clickSelect.value;
  };

  // Close Button
  const closeBtn = document.createElement('div');
  closeBtn.textContent = '✕';
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '10px',
    right: '16px',
    fontSize: '18px',
    color: 'white',
    cursor: 'pointer',
  });
  closeBtn.onclick = () => popup.remove();
  popup.appendChild(closeBtn);

  document.body.appendChild(popup);
}
function relayoutAssignedTextboxes(container, config) {
  const assigned = config.assignedNames;
  const colCount = parseInt(document.querySelector('select')?.value || 1);
  const textboxes = Array.from(document.querySelectorAll('.textbox-item'))
    .filter(el => el.dataset.linkedname && config.assignedNames.includes(el.dataset.linkedname));

const colWidth = container.clientWidth / colCount;
const totalRows = Math.ceil(assigned.length / colCount);
const spacingY = 6;
const availableH = (container.clientHeight - spacingY * (totalRows + 1)) / totalRows;
const boxHeight = Math.min(availableH, 40); // Cap max height at 40px
const availableW = colWidth - 10;
const boxWidth = Math.min(availableW, 150); // Cap max width at 150px
const totalHeight = totalRows * (boxHeight + spacingY);
const topOffset = (container.clientHeight - totalHeight) / 2;

  const canvas = document.getElementById('actual-canvas');
  const canvasW = canvas.offsetWidth;
  const canvasH = canvas.offsetHeight;

  assigned.forEach((name, i) => {
    const box = textboxes.find(el => el.getAttribute('data-linkedname') === name);
    if (!box) return;
    const colIndex = i % colCount;
    const rowIndex = Math.floor(i / colCount);

    const x = colIndex * colWidth + (colWidth - boxWidth) / 2 + 5;
    const y = topOffset + rowIndex * (boxHeight + spacingY);

    const left = (container.offsetLeft + x) / canvasW * 100;
    const top = (container.offsetTop + y) / canvasH * 100;
    const width = boxWidth / canvasW * 100;
    const height = boxHeight / canvasH * 100;

    box.style.paddingTop = '2px';
box.style.paddingBottom = '2px';
box.style.height = `${boxHeight}px`;
box.style.lineHeight = 'normal';
box.style.position = 'absolute';
    box.style.left = `${left}%`;
    box.style.top = `${top}%`;
    box.style.width = `${width}%`;
    box.style.height = `${height}%`;
  });
}
function openEventListenerPopup() {
  const eventOverlay = document.createElement('div');
  Object.assign(eventOverlay.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.8)',
    zIndex: 3000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const eventBox = document.createElement('div');
  Object.assign(eventBox.style, {
    background: '#00cfee',
    width: '90%',
    height: '90%',
    borderRadius: '24px',
    padding: '24px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
    fontFamily: 'Segoe UI, sans-serif',
  });

  const closeX = document.createElement('div');
  closeX.textContent = '✕';
  Object.assign(closeX.style, {
    position: 'absolute',
    top: '12px',
    right: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer'
  });
  closeX.onclick = () => eventOverlay.remove();

  const title = document.createElement('h2');
  title.textContent = 'Event Listeners';
  Object.assign(title.style, {
    marginTop: '0',
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
  });

  eventBox.appendChild(closeX);
  eventBox.appendChild(title);

  // ⬇️ Add more GUI content here inside eventBox if needed

  eventOverlay.appendChild(eventBox);
  document.body.appendChild(eventOverlay);
}