function CursorSettings() {
  if (document.getElementById('cursor-popup')) return;

  const storedImage = localStorage.getItem('cursorImage') || '';
  const storedSize = localStorage.getItem('cursorSize') || '100';

  const popup = document.createElement('div');
  popup.id = 'cursor-popup';
  popup.style.cssText = `
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 340px;
    padding: 20px;
    background: #00d6f6;
    border-radius: 20px;
    box-shadow: 0 0 20px rgba(0,0,0,0.4);
    z-index: 9999;
    font-family: sans-serif;
    color: white;
    text-align: center;
  `;

  popup.innerHTML = `
    <h2 style="margin-top: 0; font-size: 20px;">Cursor Settings</h2>
    <div id="cursor-image-preview" style="
      width: 100%; height: 180px;
      background: white; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; margin: 12px 0;
    ">
      ${storedImage ? `<img src="${storedImage}" id="cursor-preview-img" style="width: auto; height: auto; max-width: 100%; max-height: 100%; transform: scale(${storedSize / 100}); transform-origin: center;">` : ''}
    </div>
    <div style="margin-bottom: 14px; display: flex; align-items: center; gap: 10px;">
      <label for="cursor-size" style="font-size: 14px; color: white;">Cursor Size (%):</label>
      <input id="cursor-size" type="number" value="${storedSize}" min="1" max="500" style="
        flex: 1;
        padding: 6px;
        border-radius: 10px;
        border: none;
        font-size: 14px;
        color: black;
      ">
    </div>
    <div style="
      background: #0094b9;
      border-radius: 12px;
      padding: 10px;
      margin-bottom: 14px;
      display: flex; align-items: center; justify-content: flex-start;
      gap: 10px;
    ">
      <span style="font-size: 16px; color: white;">Upload Image:</span>
      <label for="cursor-file" style="
        display: inline-block;
        background: white;
        color: #007fa3;
        padding: 6px 12px;
        border-radius: 12px;
        cursor: pointer;
        font-weight: bold;
        white-space: nowrap;
      ">Choose Image</label>
      <input id="cursor-file" type="file" accept="image/*" style="display: none;">
    </div>
    <div style="display: flex; justify-content: space-around;">
      <button onclick="resetCursorImage()" style="background:#007fa3;color:white;padding:6px 12px;border:none;border-radius:12px;">Reset</button>
      <button onclick="closeCursorPopup()" style="background:lightgray;color:white;padding:6px 12px;border:none;border-radius:12px;">Cancel</button>
      <button onclick="applyCursorImage()" style="background:#007fa3;color:white;padding:6px 12px;border:none;border-radius:12px;">Apply</button>
    </div>
  `;

  document.body.appendChild(popup);

  const sizeInput = document.getElementById('cursor-size');
  const previewContainer = document.getElementById('cursor-image-preview');

  sizeInput.addEventListener('input', () => {
    const percent = sizeInput.value;
    const img = document.getElementById('cursor-preview-img');
    if (img) {
      img.style.transform = `scale(${percent / 100})`;
      img.style.transformOrigin = 'center';
    }
  });

  document.getElementById('cursor-file').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const base64 = e.target.result;

      sizeInput.value = 100;
      previewContainer.innerHTML = `
        <img src="${base64}" id="cursor-preview-img"
             style="width: auto; height: auto; max-width: 100%; max-height: 100%;
                    transform: scale(1); transform-origin: center;">
      `;

      localStorage.setItem('cursorImage', base64);
      localStorage.setItem('cursorSize', '100');
    };
    reader.readAsDataURL(file);
  });
}
function closeCursorPopup() {
  const popup = document.getElementById('cursor-popup');
  if (popup) popup.remove();
}
function applyCursorImage() {
  const img = document.querySelector('#cursor-preview-img');
  const size = document.getElementById('cursor-size')?.value || '100';

  if (img?.src) {
    localStorage.setItem('cursorImage', img.src);
    localStorage.setItem('cursorSize', size);
  } else {
    localStorage.removeItem('cursorImage');
    localStorage.removeItem('cursorSize');
  }

  closeCursorPopup();
}
function resetCursorImage() {
  localStorage.removeItem('cursorImage');
  localStorage.setItem('cursorSize', '100');

  const preview = document.getElementById('cursor-image-preview');
  if (preview) preview.innerHTML = '';

  const sizeInput = document.getElementById('cursor-size');
  if (sizeInput) sizeInput.value = '100';
}