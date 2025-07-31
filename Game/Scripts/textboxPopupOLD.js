function showTextboxPopup() {
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
  height: '80px', // ✅ ADD THIS
  minHeight: '60px',
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
    img.src = 'Butterfly.png';
    img.onload = () => {
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
        filter: 'drop-shadow(4px 4px 12px rgba(0,0,0,0.9))'
      });

      box.appendChild(resultImg);
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
  if (!pages[currentPage]) pages[currentPage] = [];
  pages[currentPage].push(box);
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
  title.textContent = 'Textbox Editor';
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
  colorInput.value = '#ffffff';
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

  // Style toggles
  const makeToggle = (label, key, cssProp, cssValue) => {
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

    let active = false;
    btn.onclick = () => {
      active = !active;
      btn.style.background = active ? '#005f7a' : '#009ecf';
      targetTextbox.style[cssProp] = active ? cssValue : 'initial';
    };

    return btn;
  };

  row.appendChild(makeToggle('B', 'bold', 'fontWeight', 'bold'));
  row.appendChild(makeToggle('/', 'italic', 'fontStyle', 'italic'));
  row.appendChild(makeToggle('U', 'underline', 'textDecoration', 'underline'));

  popup.appendChild(row);
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
  label.textContent = 'Textbox Editor';
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
  glow.value = config.textboxStyles?.glow || 0;

  const round = styleMiniInput(document.createElement('input'), "Roundness", () => {
    targetTextbox.style.borderRadius = `${round.value}px`;
  });
  round.type = 'number';
  round.min = 0;
  round.max = 30;
  round.value = config.textboxStyles?.radius ?? 10;

  const trans = styleMiniInput(document.createElement('input'), "Transparency", () => {
    targetTextbox.style.opacity = `${(100 - parseInt(trans.value)) / 100}`;
  });
  trans.type = 'number';
  trans.min = 0;
  trans.max = 100;
  trans.value = config.textboxStyles?.transparency || 0;

  const boxColor = document.createElement('input');
  boxColor.type = 'color';
  boxColor.value = config.textboxStyles?.boxColor || '#008fb8';
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
  };
  row.appendChild(boxColor);

  popup.appendChild(row);

  const borderLabel = document.createElement('div');
  borderLabel.textContent = 'Textbox Border';
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
  borderSize.value = config.textboxStyles?.borderSize !== undefined ? config.textboxStyles.borderSize : 0;
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

  document.body.appendChild(popup);
}





function showTextboxPopup() {
  if (document.getElementById('textbox-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'textbox-popup';
  const titleBar = document.createElement('div');
titleBar.id = 'textbox-popup-title';
titleBar.textContent = 'Textbox Editor';
popup.appendChild(titleBar);
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(to bottom, #00bfe7, #00a6cc)',
    padding: '36px 30px 40px 30px',
    borderRadius: '28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
    zIndex: 1000,
    fontFamily: 'Segoe UI, sans-serif',
    width: '420px',
    maxWidth: '95vw',
  });

  const closeX = document.createElement('div');
  closeX.textContent = '✕';
  Object.assign(closeX.style, {
    position: 'absolute',
    top: '12px',
    right: '16px',
    fontSize: '18px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#00a6cc',
    color: '#fff',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
  });
  closeX.onclick = () => popup.remove();
  popup.appendChild(closeX);

  // Load existing config or use defaults
  if (!pages[currentPage]) pages[currentPage] = [];
  if (!pages[currentPage].meta) pages[currentPage].meta = {};

  const defaultConfig = {
  width: 80,
  height: 20,
  count: 0,
  font: "Arial",
  fontSize: 16,
  color: "#ffffff",
  bold: false,
  italic: false,
  underline: false,
  glow: 0,
  radius: 12,
  transparency: 60,
  borderSize: 0,
  borderColor: "#000000",
  borderTransparency: 30,
  boxColor: "#0097b2",
  boxBgImage: null,
  bgScale: 1,
  bgOffsetX: 0,
  bgOffsetY: 0,
  align: "center",
  assignedNames: [],
  shadeMode: false,
  coverImage: null
};

const config = pages[currentPage].meta.textboxConfig
  ? { ...defaultConfig, ...JSON.parse(JSON.stringify(pages[currentPage].meta.textboxConfig)) }
  : { ...defaultConfig };

  const inputs = {};

  const makeButton = (text, onClick) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    Object.assign(btn.style, {
      flex: '1',
      padding: '10px',
      fontSize: '14px',
      fontWeight: 'bold',
      color: 'white',
      background: '#008fb8',
      border: 'none',
      borderRadius: '14px',
      cursor: 'pointer',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
      transition: 'transform 0.2s ease'
    });
    btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
    btn.onmouseleave = () => btn.style.transform = 'scale(1)';
    btn.onclick = onClick;
    return btn;
  };

  // --- Editing Buttons Row ---
 const topRow1 = document.createElement('div');
Object.assign(topRow1.style, {
  display: 'flex',
  width: '100%',
  gap: '12px'
});
topRow1.appendChild(makeButton("Text", () => openTextConfig(config, inputs)));
topRow1.appendChild(makeButton("Box", () => openBoxConfig(config, inputs)));
topRow1.appendChild(makeButton("Textbox", () => openTextboxConfig(config, inputs)));

const topRow2 = document.createElement('div');
Object.assign(topRow2.style, {
  display: 'flex',
  width: '100%',
  gap: '12px'
});
topRow2.appendChild(makeButton("Interaction", () => openInteractionConfig(config, inputs)));
topRow2.appendChild(makeButton("Image Preview", () => {
  openImagePreviewPopup({});
}));

const buttonBox = document.createElement('div');
Object.assign(buttonBox.style, {
  background: 'white',
  borderRadius: '18px',
  padding: '14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  width: '100%',
  boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)'
});
buttonBox.appendChild(topRow1);
buttonBox.appendChild(topRow2);
popup.appendChild(buttonBox);
  // --- Copy/Paste Row ---
  const middleRow = document.createElement('div');
  Object.assign(middleRow.style, {
    display: 'flex',
    width: '100%',
    gap: '12px'
  });
  middleRow.appendChild(makeButton("Copy Layout", () => copyLayout(config)));
  middleRow.appendChild(makeButton("Paste Layout", () => pasteLayout(config, inputs)));
  popup.appendChild(middleRow);
  
  const resetBtn = makeButton("Reset Layout", () => {
  if (!confirm("Are you sure you want to reset to default layout?")) return;
  Object.assign(config, {
  width: 80,
  height: 20,
  count: 5,
  font: "Arial",
  fontSize: 16,
  color: "#ffffff",
  bold: false,
  italic: false,
  underline: false,
  glow: 0,
  radius: 12,
  transparency: 60,
  borderSize: 0,
  borderColor: "#000000",
  borderTransparency: 30,
  boxColor: "#000000",
  boxBgImage: null,
  bgScale: 1,
  bgOffsetX: 0,
  bgOffsetY: 0,
  align: "center",
  assignedNames: [],
  shadeMode: false,
  coverImage: null
});

// ✅ Actually remove the existing box
const existing = document.querySelector('.textbox-container');
if (existing) existing.remove();

// ✅ Then apply the reset config visually
createTextboxContainerAdvanced(config);

alert("Layout has been reset.");
});
resetBtn.style.flex = '1';

  // --- Apply + Cancel Center ---
  const bottomRow = document.createElement('div');
Object.assign(bottomRow.style, {
  display: 'flex',
  justifyContent: 'center',
  gap: '12px',
  width: '100%',
  marginTop: '6px',
  flexWrap: 'wrap'
});
bottomRow.appendChild(makeButton("Apply", () => applyTextbox(config, popup)));
bottomRow.appendChild(makeButton("Cancel", () => popup.remove()));
bottomRow.appendChild(makeButton("Clear Textbox", () => {
  const existing = document.querySelector('.textbox-container');
  if (existing) existing.remove();
  if (pages[currentPage]?.meta?.textboxConfig) {
    delete pages[currentPage].meta.textboxConfig;
  }
  alert("Textbox removed.");
  popup.remove();
}));
bottomRow.appendChild(resetBtn);
popup.appendChild(bottomRow);
document.body.appendChild(popup);
}
function openTextConfig(config, inputs) {
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
opt.style.fontFamily = `'${f}', sans-serif`;
  fontSelect.appendChild(opt);
});

fontSelect.value = config.font || 'Arial';

Object.assign(fontSelect.style, {
  padding: '6px 12px',
  borderRadius: '12px',
  border: 'none',
  fontWeight: 'bold',
  background: '#009ecf',
  color: 'white'
});

row.appendChild(fontSelect);

  // Size
  const sizeInput = document.createElement('input');
  sizeInput.type = 'number';
  sizeInput.min = 10;
  sizeInput.max = 60;
  sizeInput.value = config.fontSize || 18;
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
  row.appendChild(sizeInput);

  // Color picker
  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = config.color || '#ffffff';
  Object.assign(colorInput.style, {
    width: '40px',
    height: '32px',
    padding: '0',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  });
  row.appendChild(colorInput);

  // Style toggles
  const makeToggle = (text, key) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    Object.assign(btn.style, {
      padding: '6px 10px',
      borderRadius: '8px',
      background: config[key] ? '#005f7a' : '#009ecf',
      color: 'white',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
    });
    btn.onclick = () => {
      config[key] = !config[key];
      btn.style.background = config[key] ? '#005f7a' : '#009ecf';
    };
    return btn;
  };

  row.appendChild(makeToggle('U', 'underline'));
  row.appendChild(makeToggle('/', 'italic'));
  row.appendChild(makeToggle('B', 'bold'));
  row.appendChild(makeToggle('☰', 'textAlignCenter')); // fake toggle for now

  popup.appendChild(row);

  // Apply button
  const applyBtn = document.createElement('button');
  applyBtn.textContent = 'Apply';
  Object.assign(applyBtn.style, {
    marginTop: '10px',
    padding: '8px 24px',
    fontWeight: 'bold',
    fontSize: '14px',
    background: '#008fb8',
    color: 'white',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer'
  });

  applyBtn.onclick = () => {
    config.font = fontSelect.value;
    config.fontSize = parseInt(sizeInput.value);
    config.color = colorInput.value;
    document.body.removeChild(popup);
  };

  popup.appendChild(applyBtn);
  document.body.appendChild(popup);
}
function openBoxConfig(config, inputs) {
  if (document.getElementById('box-config-popup')) return;

  config.boxBgOffsetX = config.boxBgOffsetX || 0;
  config.boxBgOffsetY = config.boxBgOffsetY || 0;
  config.boxBgScale = config.boxBgScale || 1;
  config.containerOffsetX = config.containerOffsetX || 0;
  config.containerOffsetY = config.containerOffsetY || 0;

  const popup = document.createElement('div');
  popup.id = 'box-config-popup';
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
  label.textContent = 'Box Editor';
  label.style.color = 'white';
  label.style.fontSize = '25px';
  label.style.fontWeight = 'bold';
  popup.appendChild(label);

  const sectionLabel = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    div.style.color = 'white';
    div.style.fontSize = '14px';
    div.style.fontWeight = 'bold';
    popup.appendChild(div);
  };

  const styleMiniInput = (input, labelText) => {
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
    wrap.appendChild(input);
    return wrap;
  };

  // === Background Section ===
  sectionLabel("Background");

  const bgLabel = document.createElement('label');
  bgLabel.textContent = 'Upload Background';
  Object.assign(bgLabel.style, {
    background: '#009ecf',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '12px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  });

  const bgInput = document.createElement('input');
  bgInput.type = 'file';
  bgInput.accept = 'image/*';
  Object.assign(bgInput.style, {
    background: '#00bfe7',
    color: '#fff',
    border: 'none',
    padding: '2px 8px',
    borderRadius: '8px',
    fontSize: '11px',
    cursor: 'pointer'
  });

  bgLabel.appendChild(bgInput);
  popup.appendChild(bgLabel);

  const bgRow = document.createElement('div');
  Object.assign(bgRow.style, {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center'
  });

  const offsetYInput = document.createElement('input');
  offsetYInput.type = 'number';
  offsetYInput.step = 1;
  offsetYInput.min = -1000;
  offsetYInput.max = 1000;
  offsetYInput.value = config.boxBgOffsetY || 0;
  bgRow.appendChild(styleMiniInput(offsetYInput, "Offset Y"));

  const offsetXInput = document.createElement('input');
  offsetXInput.type = 'number';
  offsetXInput.step = 1;
  offsetXInput.min = -1000;
  offsetXInput.max = 1000;
  offsetXInput.value = config.boxBgOffsetX || 0;
  bgRow.appendChild(styleMiniInput(offsetXInput, "Offset X"));

  const scaleInput = document.createElement('input');
  scaleInput.type = 'number';
  scaleInput.min = 0.1;
  scaleInput.max = 3;
  scaleInput.step = 0.1;
  scaleInput.value = config.boxBgScale || 1;
  bgRow.appendChild(styleMiniInput(scaleInput, "Scale"));

  popup.appendChild(bgRow);

  // === Container Section ===
  sectionLabel("Container");

  const containerRow = document.createElement('div');
  Object.assign(containerRow.style, {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center'
  });

  const glowInput = document.createElement('input');
  glowInput.type = 'number';
  glowInput.min = 0;
  glowInput.max = 20;
  glowInput.value = config.containerGlow || 0;
  containerRow.appendChild(styleMiniInput(glowInput, "Glow"));

  const colorInput = document.createElement('input');
  colorInput.type = 'color';
  colorInput.value = config.boxColor || '#000000';
  Object.assign(colorInput.style, {
    width: '40px',
    height: '30px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  });
  containerRow.appendChild(colorInput);

  const transInput = document.createElement('input');
  transInput.type = 'number';
  transInput.min = 0;
  transInput.max = 100;
  transInput.value = config.transparency || 0;
  containerRow.appendChild(styleMiniInput(transInput, "Transparency"));

  const roundInput = document.createElement('input');
  roundInput.type = 'number';
  roundInput.min = 0;
  roundInput.max = 30;
  roundInput.value = config.radius || 0;
  containerRow.appendChild(styleMiniInput(roundInput, "Roundness"));

  const heightInput = document.createElement('input');
  heightInput.type = 'number';
  heightInput.min = 0;
  heightInput.max = 100;
  heightInput.value = config.height || 60;
  containerRow.appendChild(styleMiniInput(heightInput, "Height"));

  const widthInput = document.createElement('input');
  widthInput.type = 'number';
  widthInput.min = 0;
  widthInput.max = 100;
  widthInput.value = config.width || 60;
  containerRow.appendChild(styleMiniInput(widthInput, "Width"));

  // 🆕 Container Offset Inputs
  const containerOffsetX = document.createElement('input');
  containerOffsetX.type = 'number';
  containerOffsetX.step = 1;
  containerOffsetX.min = -1000;
  containerOffsetX.max = 1000;
  containerOffsetX.value = config.containerOffsetX || 0;
  containerRow.appendChild(styleMiniInput(containerOffsetX, "Offset X"));

  const containerOffsetY = document.createElement('input');
  containerOffsetY.type = 'number';
  containerOffsetY.step = 1;
  containerOffsetY.min = -1000;
  containerOffsetY.max = 1000;
  containerOffsetY.value = config.containerOffsetY || 0;
  containerRow.appendChild(styleMiniInput(containerOffsetY, "Offset Y"));

  popup.appendChild(containerRow);

  // === Border Section ===
  sectionLabel("Box Border");

  const borderRow = document.createElement('div');
  Object.assign(borderRow.style, {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const borderSizeInput = document.createElement('input');
  borderSizeInput.type = 'number';
  borderSizeInput.min = 0;
  borderSizeInput.max = 30;
  borderSizeInput.value = config.borderSize !== undefined ? config.borderSize : 0;
  borderRow.appendChild(styleMiniInput(borderSizeInput, "Size"));

  const borderColorInput = document.createElement('input');
  borderColorInput.type = 'color';
  borderColorInput.value = config.borderColor || '#000000';
  Object.assign(borderColorInput.style, {
    width: '40px',
    height: '30px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  });
  borderRow.appendChild(borderColorInput);
  popup.appendChild(borderRow);

  // === Overflow ===
  const allowOverflowWrap = document.createElement('label');
  allowOverflowWrap.style.display = 'flex';
  allowOverflowWrap.style.alignItems = 'center';
  allowOverflowWrap.style.color = 'white';
  allowOverflowWrap.style.fontSize = '13px';
  allowOverflowWrap.style.fontWeight = 'bold';
  allowOverflowWrap.style.gap = '6px';

  const allowOverflowInput = document.createElement('input');
  allowOverflowInput.type = 'checkbox';
  allowOverflowInput.checked = config.allowOverflow || false;

  allowOverflowWrap.appendChild(allowOverflowInput);
  allowOverflowWrap.appendChild(document.createTextNode("Remove Restriction"));
  popup.appendChild(allowOverflowWrap);

  // === Apply Button ===
  const applyBtn = document.createElement('button');
  applyBtn.textContent = 'Apply';
  Object.assign(applyBtn.style, {
    marginTop: '6px',
    padding: '8px 24px',
    fontWeight: 'bold',
    fontSize: '14px',
    background: '#008fb8',
    color: 'white',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer'
  });

  applyBtn.onclick = () => {
    config.containerGlow = parseInt(glowInput.value);
    config.boxColor = colorInput.value;
    config.transparency = parseInt(transInput.value);
    config.width = parseInt(widthInput.value);
    config.height = parseInt(heightInput.value);
    config.borderSize = parseInt(borderSizeInput.value);
    config.borderColor = borderColorInput.value;
    config.radius = parseInt(roundInput.value);
    config.boxBgOffsetY = parseInt(offsetYInput.value);
    config.boxBgOffsetX = parseInt(offsetXInput.value);
    config.boxBgScale = parseFloat(scaleInput.value);
    config.containerOffsetX = parseInt(containerOffsetX.value);
    config.containerOffsetY = parseInt(containerOffsetY.value);
    config.allowOverflow = allowOverflowInput.checked;

    if (bgInput.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        config.boxBgImage = bgInput.files[0].name;
        document.body.removeChild(popup);
        createTextboxContainerAdvanced(config);
      };
      reader.readAsDataURL(bgInput.files[0]);
      return;
    }

    document.body.removeChild(popup);
    createTextboxContainerAdvanced(config);
  };

  popup.appendChild(applyBtn);
  document.body.appendChild(popup);
}
function openTextboxConfig(config, inputs) {
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
  label.textContent = 'Textbox Editor';
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

  const styleMiniInput = (input, labelText) => {
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
    wrap.appendChild(input);
    row.appendChild(wrap);
    return input;
  };

  const insetShadow = document.createElement('input');
  insetShadow.type = 'checkbox';
  insetShadow.checked = config.textboxStyles?.insetShadow || false;

  const shadowWrap = document.createElement('label');
  shadowWrap.style.display = 'flex';
  shadowWrap.style.alignItems = 'center';
  shadowWrap.style.color = 'white';
  shadowWrap.style.fontSize = '13px';
  shadowWrap.style.fontWeight = 'bold';
  shadowWrap.style.gap = '6px';
  shadowWrap.appendChild(insetShadow);
  shadowWrap.appendChild(document.createTextNode("Inset Shadow"));
  row.appendChild(shadowWrap);

  const glow = styleMiniInput(document.createElement('input'), "Glow");
  glow.type = 'number';
  glow.min = 0;
  glow.max = 20;
  glow.value = config.textboxStyles?.glow || 0;

  const round = styleMiniInput(document.createElement('input'), "Roundness");
  round.type = 'number';
  round.min = 0;
  round.max = 30;
  round.value = config.textboxStyles?.radius ?? 10;

  const trans = styleMiniInput(document.createElement('input'), "Transparency");
  trans.type = 'number';
  trans.min = 0;
  trans.max = 100;
  trans.value = config.textboxStyles?.transparency || 0;
  
  const boxWidth = styleMiniInput(document.createElement('input'), "Box Width");
  boxWidth.type = 'number';
  boxWidth.min = 20;
  boxWidth.max = 400;
  boxWidth.value = config.textboxStyles?.boxWidth || 100;

  const boxHeight = styleMiniInput(document.createElement('input'), "Box Height");
  boxHeight.type = 'number';
  boxHeight.min = 20;
  boxHeight.max = 200;
  boxHeight.value = config.textboxStyles?.boxHeight || 40;

  const boxColor = document.createElement('input');
  boxColor.type = 'color';
  boxColor.value = config.textboxStyles?.boxColor || '#008fb8';
  Object.assign(boxColor.style, {
    width: '40px',
    height: '30px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  });
  row.appendChild(boxColor);

  popup.appendChild(row);

  const borderLabel = document.createElement('div');
  borderLabel.textContent = 'Textbox Border';
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
  borderSize.value = config.textboxStyles?.borderSize !== undefined ? config.textboxStyles.borderSize : 0;

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
  Object.assign(borderColor.style, {
    width: '40px',
    height: '30px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  });
  borderRow.appendChild(borderColor);
  popup.appendChild(borderRow);
  
  const assignedLabel = document.createElement('div');
  assignedLabel.textContent = 'Assigned Images';
  assignedLabel.style.color = 'white';
  assignedLabel.style.fontWeight = 'bold';
  popup.appendChild(assignedLabel);

  const imageListWrapper = document.createElement('div');
  imageListWrapper.style.display = 'flex';
  imageListWrapper.style.flexDirection = 'column';
  imageListWrapper.style.gap = '6px';
  imageListWrapper.style.marginTop = '4px';
  imageListWrapper.style.padding = '4px 0';
  imageListWrapper.style.maxHeight = '120px';
  imageListWrapper.style.overflowY = 'auto';

  const imageCheckboxes = [];
  const imagePool = (pages[currentPage]?.meta?.namedImages || []).map(obj => obj.name);

  imagePool.forEach(name => {
    const label = document.createElement('label');
    label.style.color = 'white';
    label.style.fontSize = '13px';
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '8px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = name;
    if ((config.assignedNames || []).includes(name)) {
      checkbox.checked = true;
    }

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(name));
    imageListWrapper.appendChild(label);
    imageCheckboxes.push(checkbox);
  });

  popup.appendChild(imageListWrapper);

  const applyBtn = document.createElement('button');
  applyBtn.textContent = 'Apply';
  Object.assign(applyBtn.style, {
    marginTop: '8px',
    padding: '8px 24px',
    fontWeight: 'bold',
    fontSize: '14px',
    background: '#008fb8',
    color: 'white',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer'
  });

  applyBtn.onclick = () => {
    const selected = imageCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
    config.assignedNames = selected;
    config.count = selected.length;
    config.textboxStyles = {
      glow: parseInt(glow.value),
      radius: parseInt(round.value),
      transparency: parseInt(trans.value),
      boxColor: boxColor.value,
      borderSize: parseInt(borderSize.value),
      borderColor: borderColor.value,
      insetShadow: insetShadow.checked,
      boxWidth: parseInt(boxWidth.value),
      boxHeight: parseInt(boxHeight.value)
    };
    document.body.removeChild(popup);
  };

  popup.appendChild(applyBtn);
  document.body.appendChild(popup);
}
function copyLayout(config) {
  savedTextboxLayout = JSON.parse(JSON.stringify(config));
  alert("Layout copied!");
}
function pasteLayout(config, inputs) {
  if (!savedTextboxLayout) return alert("No layout copied.");
  Object.assign(config, savedTextboxLayout);
  alert("Layout pasted!");
}
function applyTextbox(config, popup) {
  popup.remove();

  // 🔄 Save config to current page's meta
  if (!pages[currentPage]) pages[currentPage] = [];
  if (!pages[currentPage].meta) pages[currentPage].meta = {};
  pages[currentPage].meta.textboxConfig = JSON.parse(JSON.stringify(config));

  // 🔧 Then create the box
  createTextboxContainerAdvanced(config);
}
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
function updateLiveTextboxPreview(config) {
  const existing = document.querySelector('.textbox-container');
  if (existing) existing.remove();
  createTextboxContainerAdvanced(config, true); // true = livePreview
}
function createTextboxContainerAdvanced(config) {
  const canvas = document.getElementById("actual-canvas");
canvas.querySelectorAll('.textbox-container').forEach(el => el.remove());


  // ✅ Free-floating background image (overflow mode)
  if (config.allowOverflow && config.boxBgImage) {
    const bgImg = document.createElement("img");
    bgImg.src = config.boxBgImage;
    bgImg.classList.add("textbox-container");
    bgImg.style.position = "absolute";
    bgImg.style.pointerEvents = "none";
    bgImg.style.left = "50%";
    bgImg.style.bottom = "0";
    const offsetX = config.boxBgOffsetX || 0;
    const offsetY = config.boxBgOffsetY || 0;
    const scale = config.boxBgScale || 1;
    bgImg.style.transform = `translateX(-50%) translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    bgImg.style.zIndex = "10";

    bgImg.dataset.config = JSON.stringify(config);
    bgImg.dataset.page = currentPage;
    if (!pages[currentPage]) pages[currentPage] = [];
    pages[currentPage].push(bgImg);
    canvas.appendChild(bgImg);
    return;
  }

  const container = document.createElement("div");
  container.classList.add("textbox-container", "selectable");
  container.style.position = "absolute";
  const offsetX = config.containerOffsetX || 50; // default center
const offsetY = config.containerOffsetY || 0;
container.style.left = `${offsetX}%`;
container.style.bottom = `${offsetY}%`;
container.style.transform = `translateX(-50%)`;
  container.style.width = (config.width || 80) + "%";
  container.style.height = (config.height || 20) + "%";
  container.style.display = "flex";
  container.style.flexWrap = "wrap";
  container.style.justifyContent = "space-evenly";
  container.style.flexWrap = "wrap";
  container.style.alignItems = config.align === "top" ? "flex-start" : "center";
  container.style.fontFamily = config.font || "Arial";
  container.style.fontSize = config.fontSize || "16px";
  container.style.color = config.color || "#ffffff";
  container.style.border = `${config.borderSize || 0}px solid ${hexToRgba(config.borderColor || "#000000", 1 - (config.borderTransparency || 0) / 100)}`;
  container.style.borderRadius = (config.radius || 0) + "px";
  container.style.padding = "8px";
  container.style.zIndex = "10";
  container.style.overflow = "hidden";

  // Background within box
  container.style.background = config.boxBgImage
    ? `url(${config.boxBgImage}) ${config.boxBgOffsetX || 0}px ${config.boxBgOffsetY || 0}px / ${100 * (config.boxBgScale || 1)}% auto no-repeat`
    : hexToRgba(config.boxColor || "#000000", 1 - (config.transparency || 0) / 100);

  if (config.containerGlow && config.containerGlow > 0) {
    container.style.boxShadow = `0 0 ${config.containerGlow}px ${config.boxColor || "#000000"}`;
  }

  const spacing = config.itemSpacing ?? 4;
  const selectedNames = (config.assignedNames || []).slice();
  const style = config.textboxStyles || {};

  for (let i = 0; i < config.count; i++) {
    const item = document.createElement("div");
    item.classList.add("textbox-item");

    const label = selectedNames[i] || "Item";
    item.textContent = label;
    item.dataset.linkedName = label;

    if (!config.texts) config.texts = [];
    config.texts[i] = label;

    item.style.margin = config.stationaryLayout ? "0" : `${spacing}px`;
    item.style.minWidth = (style.boxWidth || 100) + "px";
    item.style.width = (style.boxWidth || 100) + "px";
    item.style.height = (style.boxHeight || 40) + "px";
    item.style.display = "flex";
    item.style.justifyContent = "center";
    item.style.visibility = "visible";
    item.style.alignItems = "center";
    item.style.justifyContent = "center";
    item.style.background = hexToRgba(style.boxColor || "#ffffff", 1 - (style.transparency || 0) / 100);
    item.style.borderRadius = (style.radius || 0) + "px";
    item.style.border = `${style.borderSize || 0}px solid ${hexToRgba(style.borderColor || "#000000", 1)}`;
    item.style.whiteSpace = "nowrap";
    item.style.fontFamily = config.font || "Arial";
    item.style.fontSize = (config.fontSize || 16) + "px";
    item.style.color = config.color || "#000000";
    item.style.fontWeight = config.bold ? "bold" : "normal";
    item.style.fontStyle = config.italic ? "italic" : "normal";
    item.style.textDecoration = config.underline ? "underline" : "none";
    item.style.padding = "6px 12px";

    const shadows = [];
    if (style.glow > 0) {
      shadows.push(`0 0 ${style.glow}px ${config.color || "#000000"}`);
    }
    if (style.insetShadow) {
      shadows.push('inset 0 0 10px rgba(0,0,0,0.4)');
    }
    item.style.boxShadow = shadows.join(', ');
    item.style.pointerEvents = "none";

    container.appendChild(item);
  }

  const prev = container.dataset.config ? JSON.parse(container.dataset.config) : {};
container.dataset.config = JSON.stringify({ ...prev, ...config });
  container.dataset.page = currentPage;
  if (!pages[currentPage]) pages[currentPage] = [];
  pages[currentPage].push(container);
  canvas.appendChild(container);
}