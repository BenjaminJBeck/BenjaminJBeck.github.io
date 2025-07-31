function openImagePreviewPopup(config = {}) {
  if (document.getElementById('image-preview-popup')) return;

  // Load from saved config if available
  if (!Object.keys(config).length && pages[currentPage]?.meta?.imagePreviewConfig) {
    config = { ...pages[currentPage].meta.imagePreviewConfig };
  }

  const popup = document.createElement('div');
  popup.id = 'image-preview-popup';
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#00cfee',
    padding: '32px',
    borderRadius: '28px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '18px',
    fontFamily: 'Segoe UI, sans-serif',
    zIndex: 3000,
    width: '620px'
  });

  const makeLabel = (text) => {
    const label = document.createElement('label');
    label.textContent = text;
    label.style.color = 'white';
    label.style.fontWeight = 'bold';
    return label;
  };

  const makeNumber = (val = 0) => {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = val;
    Object.assign(input.style, {
      width: '70px',
      padding: '6px',
      borderRadius: '12px',
      border: 'none',
      textAlign: 'center',
      background: '#0097b2',
      color: 'white',
      fontWeight: 'bold'
    });
    return input;
  };

  const makeColor = (val = '#ffffff') => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = val;
    Object.assign(input.style, {
      width: '36px',
      height: '36px',
      borderRadius: '12px',
      border: 'none',
      padding: '8',
      cursor: 'pointer',
      background: '#0097b2',
    });
    return input;
  };

  const makeCheckbox = (checked = false) => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;
    input.style.transform = 'scale(1.3)';
    return input;
  };

  const createRow = (...entries) => {
    const row = document.createElement('div');
    Object.assign(row.style, {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr auto 1fr auto',
      gap: '16px',
      alignItems: 'center',
      width: '100%'
    });
    for (let i = 0; i < entries.length; i += 2) {
      row.appendChild(makeLabel(entries[i]));
      row.appendChild(entries[i + 1]);
    }
    return row;
  };

  const topRow = document.createElement('div');
  Object.assign(topRow.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  });

  const title = document.createElement('div');
  title.textContent = 'Image Preview';
  Object.assign(title.style, {
    background: 'white',
    color: '#00a7d0',
    padding: '8px 18px',
    fontWeight: 'bold',
    borderRadius: '24px',
    fontSize: '15px'
  });

  const activeWrap = document.createElement('div');
  Object.assign(activeWrap.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  const activeLabel = makeLabel("Active");
  const activeToggle = makeCheckbox(config.active || false);
  activeWrap.appendChild(activeLabel);
  activeWrap.appendChild(activeToggle);

  topRow.appendChild(title);
  topRow.appendChild(activeWrap);
  popup.appendChild(topRow);

  const heightInput = makeNumber(config.height || 0);
  const widthInput = makeNumber(config.width || 0);
  const roundness = makeNumber(config.roundness || 0);
  popup.appendChild(createRow("Height", heightInput, "Width", widthInput, "Roundness", roundness));

  const offsetX = makeNumber(config.x || 0);
  const offsetY = makeNumber(config.y || 0);
  const transparency = makeNumber(config.transparency || 0);
const imageOffsetX = makeNumber(config.imageOffsetX || 0);
const imageOffsetY = makeNumber(config.imageOffsetY || 0);
popup.appendChild(createRow("X-Offset", offsetX, "Y-Offset", offsetY, "Transparency", transparency));

const imageScale = makeNumber(config.imageScale || 1);
const imageShadow = makeCheckbox(config.imageShadow || false);
popup.appendChild(createRow("Image X-Offset", imageOffsetX, "Image Y-Offset", imageOffsetY, "Image Scale", imageScale));

const bgOffsetX = makeNumber(config.bgOffsetX || 0);
const bgOffsetY = makeNumber(config.bgOffsetY || 0);
const bgScale = makeNumber(config.bgScale || 1);
popup.appendChild(createRow("Background X-Offset", bgOffsetX, "Background Y-Offset", bgOffsetY, "Background Scale", bgScale));
  const colorInput = makeColor(config.color || '#ffffff');
  const borderColor = makeColor(config.borderColor || '#000000');
  const imgColor = makeColor(config.imageColor || '#ffffff');
  popup.appendChild(createRow("Color", colorInput, "Border Color", borderColor, "Image Color", imgColor));

  const borderSize = makeNumber(config.borderSize || 0);
  const shadowCheckbox = makeCheckbox(config.shadow || false);
  const bgUpload = document.createElement('input');
  bgUpload.type = 'file';
  bgUpload.accept = 'image/*';

  if (config.backgroundImage) {
    bgUpload.setAttribute('data-saved', config.backgroundImage);
  }

  Object.assign(bgUpload.style, {
    background: '#0097b2',
    color: 'white',
    borderRadius: '12px',
    border: 'none',
    padding: '6px 10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '160px'
  });
  popup.appendChild(createRow("Border Size", borderSize, "Shadow", shadowCheckbox, "Background", bgUpload));

  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.justifyContent = 'space-between';
  btnRow.style.gap = '14px';
  btnRow.style.marginTop = '14px';

  const cancel = document.createElement('button');
  cancel.textContent = 'Cancel';
  Object.assign(cancel.style, {
    background: 'gray',
    color: 'white',
    borderRadius: '20px',
    border: 'none',
    padding: '8px 24px',
    cursor: 'pointer'
  });
  cancel.onclick = () => popup.remove();

  const apply = document.createElement('button');
  apply.textContent = 'Apply';
  Object.assign(apply.style, {
    background: '#007ea3',
    color: 'white',
    borderRadius: '20px',
    border: 'none',
    padding: '8px 24px',
    cursor: 'pointer'
  });

  apply.onclick = () => {
    config.active = activeToggle.checked;
    config.height = parseInt(heightInput.value);
    config.width = parseInt(widthInput.value);
    config.roundness = parseInt(roundness.value);
    config.x = parseInt(offsetX.value);
    config.y = parseInt(offsetY.value);
    config.transparency = parseInt(transparency.value);
    config.color = colorInput.value;
    config.borderColor = borderColor.value;
    config.borderSize = parseInt(borderSize.value);
    config.imageColor = imgColor.value;
    config.shadow = shadowCheckbox.checked;
    config.imageOffsetX = parseInt(imageOffsetX.value);
config.imageOffsetY = parseInt(imageOffsetY.value);
config.imageScale = parseFloat(imageScale.value);
config.imageShadow = imageShadow.checked;

config.bgOffsetX = parseInt(bgOffsetX.value);
config.bgOffsetY = parseInt(bgOffsetY.value);
config.bgScale = parseFloat(bgScale.value);
config.removeRestriction = removeRestriction.checked;

    if (bgUpload.files[0]) {
      config.backgroundImage = bgUpload.files[0].name;
    } else if (bgUpload.getAttribute('data-saved')) {
      config.backgroundImage = bgUpload.getAttribute('data-saved');
    }

    if (!pages[currentPage].meta) pages[currentPage].meta = {};
    pages[currentPage].meta.imagePreviewConfig = { ...config };

    popup.remove();
    createImagePreviewBox(config);
  };

  const reset = document.createElement('button');
  reset.textContent = 'Reset';
  Object.assign(reset.style, {
    background: '#0097b2',
    color: 'white',
    borderRadius: '20px',
    border: 'none',
    padding: '8px 24px',
    cursor: 'pointer'
  });
  reset.onclick = () => {
    popup.remove();
    openImagePreviewPopup(); // Fresh config
  };

  btnRow.appendChild(cancel);
  btnRow.appendChild(reset);
  btnRow.appendChild(apply);
 const removeRestriction = makeCheckbox(config.removeRestriction || false);
popup.appendChild(createRow("Image Shadow", imageShadow, "Remove Restriction", removeRestriction));
  popup.appendChild(btnRow);
  document.body.appendChild(popup);
}

function createImagePreviewBox(config) {
  const canvas = document.getElementById("actual-canvas");

  // Remove previous image preview if it exists
  canvas.querySelectorAll('.image-preview-box').forEach(el => el.remove());

  if (!config || !config.active) return;

  const imgBox = document.createElement("div");
  imgBox.classList.add("image-preview-box");
  imgBox.style.position = "absolute";
  imgBox.style.left = "50%";
  imgBox.style.top = "50%";
  imgBox.style.transform = `translate(-50%, -50%) translate(${config.x || 0}px, ${config.y || 0}px)`;
  imgBox.style.width = (config.width || 100) + "px";
  imgBox.style.height = (config.height || 100) + "px";
  imgBox.style.borderRadius = (config.roundness || 0) + "px";
  imgBox.style.border = `${config.borderSize || 0}px solid ${config.borderColor || "#000"}`;
  imgBox.style.backgroundColor = config.color || "#fff";
  imgBox.style.opacity = 1 - (config.transparency || 0) / 100;
  imgBox.style.zIndex = "20";
  imgBox.style.display = "flex";
  imgBox.style.alignItems = "center";
  imgBox.style.justifyContent = "center";
  imgBox.style.pointerEvents = "none";
  if (config.shadow) {
    imgBox.style.boxShadow = "0 0 10px rgba(0,0,0,0.4)";
  }

if (config.backgroundImage) {
  const img = document.createElement("img");
  img.src = `Images/${config.backgroundImage}`;

  img.onload = () => {
    const boxW = imgBox.clientWidth;
    const boxH = imgBox.clientHeight;

    const scale = config.imageScale || 1;
    const imgW = img.naturalWidth * scale;
    const imgH = img.naturalHeight * scale;

    const scaleX = boxW / imgW;
    const scaleY = boxH / imgH;
    const finalScale = Math.min(1, scaleX, scaleY); // Always fit inside box

    img.style.transform = `translate(-50%, -50%) scale(${finalScale * scale}) translate(${config.imageOffsetX || 0}px, ${config.imageOffsetY || 0}px)`;
  };

  Object.assign(img.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "inherit",
    filter: `drop-shadow(0 0 0 ${config.imageColor || "#fff"})`,
    pointerEvents: "none",
    transformOrigin: "center center"
  });

  imgBox.appendChild(img);
}
  imgBox.dataset.config = JSON.stringify(config);
  imgBox.dataset.page = currentPage;

  if (!pages[currentPage]) pages[currentPage] = [];
  pages[currentPage].push(imgBox);
  canvas.appendChild(imgBox);
}