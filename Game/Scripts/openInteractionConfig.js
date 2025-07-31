function openInteractionConfig() {
  const existingPopup = document.getElementById('interaction-config-popup');
if (existingPopup) {
  existingPopup.remove();
  document.querySelector('div[style*="position: fixed"][style*="z-index: 99999"]')?.remove(); // optional blocker
  return;
}
  
  if (document.getElementById('interaction-config-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'interaction-config-popup';
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(to bottom, #00cfee, #009bbf)',
    padding: '25px 35px',
    borderRadius: '24px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: 'white',
    fontFamily: 'sans-serif',
    fontSize: '18px',
    zIndex: 9999,
    minWidth: '300px'
  });

  const title = document.createElement('div');
  title.textContent = 'Interaction Animation';
  Object.assign(title.style, {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '20px'
  });
  popup.appendChild(title);

  // Image animation dropdown
  const imageLabel = document.createElement('label');
  imageLabel.textContent = 'Image Animation:';
  Object.assign(imageLabel.style, { marginBottom: '10px', width: '100%' });

  const imageSelect = document.createElement('select');
  imageSelect.id = 'image-animation-select';
  ['Animation 1', 'Animation 2', 'Fade', 'Custom'].forEach((text, i) => {
  const value = ['anim1', 'anim2', 'fade', 'customanim'][i];
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = text;
    if (value === (pages[currentPage]?.meta?.textboxConfig?.imageAnimation || 'fade')) {
      opt.selected = true;
    }
    imageSelect.appendChild(opt);
  });

  Object.assign(imageSelect.style, {
    width: '100%',
    padding: '8px',
    borderRadius: '12px',
    border: 'none',
    marginTop: '6px',
    fontSize: '16px',
    color: 'black'
  });

  imageLabel.appendChild(imageSelect);
  popup.appendChild(imageLabel);
  
  const imageTextarea = document.createElement('textarea');
imageTextarea.id = 'image-custom-code';
imageTextarea.placeholder = '// Custom image animation code...';
imageTextarea.value = pages[currentPage]?.meta?.textboxConfig?.imageCustomCode || '';
Object.assign(imageTextarea.style, {
  width: '100%',
  height: '80px',
  borderRadius: '12px',
  border: 'none',
  marginTop: '8px',
  fontSize: '14px',
  padding: '10px',
  resize: 'vertical',
  color: 'black'
});
popup.appendChild(imageTextarea);

const imgBtnRow = document.createElement('div');
Object.assign(imgBtnRow.style, { display: 'flex', gap: '10px', marginTop: '6px' });

const importImgBtn = document.createElement('button');
importImgBtn.textContent = 'Save';
importImgBtn.onclick = () => {
  const config = pages[currentPage].meta.textboxConfig || {};
  config.imageCustomCode = imageTextarea.value;
  pages[currentPage].meta.textboxConfig = config;
};

const clearImgBtn = document.createElement('button');
clearImgBtn.textContent = 'Clear';
clearImgBtn.onclick = () => imageTextarea.value = '';

[importImgBtn, clearImgBtn].forEach(btn => {
  Object.assign(btn.style, {
    padding: '6px 14px',
    borderRadius: '10px',
    border: 'none',
    background: '#006b80',
    color: 'white',
    cursor: 'pointer'
  });
  imgBtnRow.appendChild(btn);
});
popup.appendChild(imgBtnRow);

  // Textbox animation dropdown
  const textboxLabel = document.createElement('label');
  textboxLabel.textContent = 'Textbox Animation:';
  Object.assign(textboxLabel.style, { marginTop: '20px', marginBottom: '10px', width: '100%' });

  const textboxSelect = document.createElement('select');
  textboxSelect.id = 'textbox-animation-select';
  ['Fade', 'Shade', 'Cross Out', 'Custom'].forEach((text, i) => {
  const value = ['fade', 'shade', 'cross', 'customanim'][i];
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = text;
    if (value === (pages[currentPage]?.meta?.textboxConfig?.textboxAnimation || 'fade')) {
      opt.selected = true;
    }
    textboxSelect.appendChild(opt);
  });

  Object.assign(textboxSelect.style, {
    width: '100%',
    padding: '8px',
    borderRadius: '12px',
    border: 'none',
    marginTop: '6px',
    fontSize: '16px',
    color: 'black'
  });

  textboxLabel.appendChild(textboxSelect);
  popup.appendChild(textboxLabel);
  
  const textboxTextarea = document.createElement('textarea');
textboxTextarea.id = 'textbox-custom-code';
textboxTextarea.placeholder = '// Custom textbox animation code...';
textboxTextarea.value = pages[currentPage]?.meta?.textboxConfig?.textboxCustomCode || '';
Object.assign(textboxTextarea.style, {
  width: '100%',
  height: '80px',
  borderRadius: '12px',
  border: 'none',
  marginTop: '8px',
  fontSize: '14px',
  padding: '10px',
  resize: 'vertical',
  color: 'black'
});
popup.appendChild(textboxTextarea);

const tbBtnRow = document.createElement('div');
Object.assign(tbBtnRow.style, { display: 'flex', gap: '10px', marginTop: '6px' });

const importTbBtn = document.createElement('button');
importTbBtn.textContent = 'Save';
importTbBtn.onclick = () => {
  const config = pages[currentPage].meta.textboxConfig || {};
  config.textboxCustomCode = textboxTextarea.value;
  pages[currentPage].meta.textboxConfig = config;
};
const clearTbBtn = document.createElement('button');
clearTbBtn.textContent = 'Clear';
clearTbBtn.onclick = () => textboxTextarea.value = '';

[importTbBtn, clearTbBtn].forEach(btn => {
  Object.assign(btn.style, {
    padding: '6px 14px',
    borderRadius: '10px',
    border: 'none',
    background: '#006b80',
    color: 'white',
    cursor: 'pointer'
  });
  tbBtnRow.appendChild(btn);
});
popup.appendChild(tbBtnRow);

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Apply';
  closeBtn.onclick = () => {
    const config = pages[currentPage].meta.textboxConfig || {};
    config.imageAnimation = document.getElementById('image-animation-select').value;
config.textboxAnimation = document.getElementById('textbox-animation-select').value;
config.imageCustomCode = document.getElementById('image-custom-code')?.value || '';
config.textboxCustomCode = document.getElementById('textbox-custom-code')?.value || '';
    pages[currentPage].meta.textboxConfig = config;
    popup.remove();
  };

  Object.assign(closeBtn.style, {
    marginTop: '30px',
    padding: '10px 20px',
    borderRadius: '14px',
    border: 'none',
    fontWeight: 'bold',
    background: '#007d94',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
    transition: 'background 0.3s, transform 0.2s'
  });

  closeBtn.onmouseenter = () => (closeBtn.style.background = '#006b80');
  closeBtn.onmouseleave = () => (closeBtn.style.background = '#007d94');
  closeBtn.onmousedown = () => (closeBtn.style.transform = 'scale(0.95)');
  closeBtn.onmouseup = () => (closeBtn.style.transform = 'scale(1)');

  popup.appendChild(closeBtn);
  
  // Cancel button
const cancelBtn = document.createElement('button');
cancelBtn.textContent = 'Cancel';
cancelBtn.onclick = () => popup.remove();

Object.assign(cancelBtn.style, {
  marginTop: '10px',
  padding: '10px 20px',
  borderRadius: '14px',
  border: 'none',
  fontWeight: 'bold',
  background: '#999',
  color: 'white',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
  transition: 'background 0.3s, transform 0.2s'
});

cancelBtn.onmouseenter = () => (cancelBtn.style.background = '#777');
cancelBtn.onmouseleave = () => (cancelBtn.style.background = '#999');
cancelBtn.onmousedown = () => (cancelBtn.style.transform = 'scale(0.95)');
cancelBtn.onmouseup = () => (cancelBtn.style.transform = 'scale(1)');

popup.appendChild(cancelBtn);

  document.body.appendChild(popup);
}