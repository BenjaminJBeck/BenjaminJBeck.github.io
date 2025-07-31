function openHelpPopup() {
  const existingPopup = document.getElementById('help-popup');
if (existingPopup) {
  existingPopup.remove();
  document.querySelector('div[style*="position: fixed"][style*="z-index: 99999"]')?.remove(); // optional blocker
  return;
}
  
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