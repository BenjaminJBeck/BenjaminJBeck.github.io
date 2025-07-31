function addMusic() {
  const existingPopup = document.getElementById('sound-editor-popup');
if (existingPopup) {
  existingPopup.remove();
  document.querySelector('div[style*="position: fixed"][style*="z-index: 99999"]')?.remove(); // optional blocker
  return;
}
  
  if (document.getElementById('sound-editor-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'sound-editor-popup';
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#00cfee',
    padding: '30px',
    borderRadius: '32px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    fontFamily: 'Segoe UI, sans-serif',
    zIndex: 3000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '360px',
    gap: '10px'
  });

  const title = document.createElement('h2');
  title.textContent = 'Music Editor';
  title.style.color = 'white';
  title.style.margin = '10px 0 0 0';
  popup.appendChild(title);

  const divider = document.createElement('hr');
  divider.style.width = '100%';
  divider.style.borderTop = '3px solid black';
  popup.appendChild(divider);

  const musicContainer = document.createElement('div');
  musicContainer.style.display = 'flex';
  musicContainer.style.flexDirection = 'column';
  musicContainer.style.gap = '10px';
  popup.appendChild(musicContainer);

  if (!pages[currentPage].meta) pages[currentPage].meta = {};
  if (!pages[currentPage].meta.pageMusic) pages[currentPage].meta.pageMusic = [];

  const musicData = (pages[currentPage].meta.musicConfig?.tracks || []).map(track => track.dataURL);

  const addMusicRow = (fileData = '') => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'center';

    const uploadBtn = document.createElement('button');
    uploadBtn.textContent = 'Upload MP3';
    if (fileData) row.dataset.file = fileData;
    Object.assign(uploadBtn.style, {
      padding: '6px 12px',
      borderRadius: '14px',
      border: 'none',
      background: '#007ea6',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer'
    });

    const label = document.createElement('span');
    label.textContent = fileData ? 'Saved MP3' : '';
    label.style.color = 'white';
    label.style.fontSize = '14px';
    label.style.maxWidth = '120px';
    label.style.overflow = 'hidden';
    label.style.textOverflow = 'ellipsis';

    uploadBtn.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'audio/mp3';
      input.onchange = () => {
        if (input.files[0]) {
          const reader = new FileReader();
reader.onload = (e) => {
  const dataURL = e.target.result;
  label.textContent = input.files[0].name;
  row.dataset.file = dataURL;
};
reader.readAsDataURL(input.files[0]);
        }
      };
      input.click();
    };

    row.appendChild(uploadBtn);
    row.appendChild(label);
    const deleteBtn = document.createElement('button');
deleteBtn.textContent = '❌';
Object.assign(deleteBtn.style, {
  background: 'transparent',
  border: 'none',
  color: 'white',
  fontSize: '18px',
  cursor: 'pointer'
});
deleteBtn.onclick = () => row.remove();
row.appendChild(deleteBtn);
    musicContainer.appendChild(row);
  };

  // Load saved music rows
  if (musicData.length) {
    musicData.forEach(file => addMusicRow(file));
  } else {
    addMusicRow();
  }

  const plusBtn = document.createElement('button');
  plusBtn.textContent = '+';
  Object.assign(plusBtn.style, {
    background: '#009fcf',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    border: 'none',
    fontWeight: 'bold',
    fontSize: '20px',
    cursor: 'pointer'
  });
  plusBtn.onclick = () => addMusicRow();
  popup.appendChild(plusBtn);

  const spacingRow = document.createElement('div');
  spacingRow.style.display = 'flex';
  spacingRow.style.alignItems = 'center';
  spacingRow.style.gap = '8px';

  const spacingLabel = document.createElement('div');
  spacingLabel.textContent = 'Spacing (s)';
  spacingLabel.style.color = 'white';

  const spacingInput = document.createElement('select');
  for (let i = 0; i <= 1000; i++) {
    const opt = document.createElement('option');
    opt.textContent = i;
    spacingInput.appendChild(opt);
  }
  spacingInput.value = pages[currentPage].meta.pageMusicSpacing || 0;
  Object.assign(spacingInput.style, {
    padding: '4px 6px',
    borderRadius: '8px',
    border: 'none',
    background: 'white'
  });

  spacingRow.appendChild(spacingLabel);
  spacingRow.appendChild(spacingInput);
  popup.appendChild(spacingRow);

  const copyPasteRow = document.createElement('div');
  copyPasteRow.style.display = 'flex';
  copyPasteRow.style.gap = '20px';

  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copy';
  const pasteBtn = document.createElement('button');
  pasteBtn.textContent = 'Paste';

  [copyBtn, pasteBtn].forEach(btn => {
    Object.assign(btn.style, {
      padding: '8px 20px',
      background: '#007ea6',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      fontWeight: 'bold',
      cursor: 'pointer'
    });
  });

  

  const bottomRow = document.createElement('div');
  bottomRow.style.display = 'flex';
  bottomRow.style.justifyContent = 'space-between';
  bottomRow.style.marginTop = '20px';
  bottomRow.style.width = '100%';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  Object.assign(cancelBtn.style, {
    padding: '10px 24px',
    background: '#aaa',
    border: 'none',
    borderRadius: '20px',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer'
  });
  cancelBtn.onclick = () => popup.remove();

  const applyBtn = document.createElement('button');
  applyBtn.textContent = 'Apply';
  Object.assign(applyBtn.style, {
    padding: '10px 24px',
    background: '#007ea6',
    border: 'none',
    borderRadius: '20px',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer'
  });
  applyBtn.onclick = () => {
    pages[currentPage].meta.musicConfig = {
  tracks: Array.from(musicContainer.children)
    .map(row => row.dataset.file)
    .filter(Boolean)
    .map(dataURL => ({ dataURL })),
  spacing: spacingInput.value
};
    popup.remove();
  };

  bottomRow.appendChild(cancelBtn);
  bottomRow.appendChild(applyBtn);
  popup.appendChild(bottomRow);

  document.body.appendChild(popup);
}
