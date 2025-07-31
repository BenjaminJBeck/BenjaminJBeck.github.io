function showButtonPopup() {
  if (document.getElementById('button-popup')) return;
  
  const popup = document.createElement('div');
  popup.id = 'button-popup';
  Object.assign(popup.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'linear-gradient(to bottom, #00bfe7, #00a6cc)',
    padding: '40px 30px 50px 30px',
    borderRadius: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
    zIndex: '1000',
    fontFamily: 'Segoe UI, sans-serif',
    width: '480px',
    maxWidth: '95vw'
  });
  
  const closeX = document.createElement('div');
  closeX.textContent = '✕';
  Object.assign(closeX.style, {
    position: 'absolute',
    top: '12px',
    right: '16px',
    fontSize: '18px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    color: '#007ea6',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
  });
  closeX.onclick = () => popup.remove();
  popup.appendChild(closeX);
  
  const label = document.createElement('div');
  label.textContent = 'Buttons';
  Object.assign(label.style, {
    fontSize: '22px',
    fontWeight: 'bold',
    color: 'white',
    marginTop: '6px'
  });
  popup.appendChild(label);
  
  const buttonList = ['Next Level', 'Main Menu', 'Settings', 'Play Game', 'Help', 'Credits', 'Hint', 'Skip Level', 'Inventory', 'Options', 'Exit Game'];
  const grid = document.createElement('div');
  Object.assign(grid.style, {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    background: 'white',
    padding: '20px',
    borderRadius: '20px',
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.08)',
    width: '100%',
    boxSizing: 'border-box'
  });
  
  buttonList.forEach(label => {
    const btn = document.createElement('div');
    btn.textContent = label;
    Object.assign(btn.style, {
      background: '#009ecf',
      color: 'white',
      padding: '10px 12px',
      borderRadius: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
      transition: 'background 0.2s ease',
      whiteSpace: 'nowrap'  // ✅ prevents wrapping
    });
    btn.onmouseenter = () => btn.style.background = '#007ea6';
    btn.onmouseleave = () => btn.style.background = '#009ecf';
    btn.onclick = () => {
      addPredefinedButton(label);
      popup.remove();
    };
    grid.appendChild(btn);
  });
  popup.appendChild(grid);
  
  const layoutControls = document.createElement('div');
  layoutControls.style.display = 'flex';
  layoutControls.style.gap = '14px';
  ['Copy Layout', 'Paste Layout', 'Close'].forEach(text => {
    const btn = document.createElement('div');
    btn.textContent = text;
    Object.assign(btn.style, {
      padding: '10px 16px',
      borderRadius: '22px',
      background: '#00688b',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background 0.2s ease',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
    });
    btn.onmouseenter = () => btn.style.background = '#004f6b';
    btn.onmouseleave = () => btn.style.background = '#00688b';
    btn.onclick = () => {
      if (text === 'Close') popup.remove();
      else if (text === 'Copy Layout') copyButtonLayout();
      else if (text === 'Paste Layout') pasteButtonLayout();
    };
    layoutControls.appendChild(btn);
  });
  popup.appendChild(layoutControls);
  
  document.body.appendChild(popup);
}



function copyButtonLayout() {
  const canvas = document.getElementById('actual-canvas');
  copiedButtonLayout = [];
  canvas.querySelectorAll('button').forEach(btn => {
    copiedButtonLayout.push({
      text: btn.textContent,
      top: btn.style.top,
      left: btn.style.left,
      width: btn.style.width,
      height: btn.style.height,
      transform: btn.style.transform,
      style: btn.style.cssText
    });
  });
  alert("Layout copied!");
}

function pasteButtonLayout() {
  if (!copiedButtonLayout || copiedButtonLayout.length === 0) {
    alert("No layout copied.");
    return;
  }
  copiedButtonLayout.forEach(data => {
    const btn = document.createElement('button');
    btn.textContent = data.text;
    btn.classList.add('selectable', 'selectable-button');
    btn.style.cssText = data.style;
    btn.onclick = (e) => {
      if (document.body.classList.contains('preview-fullscreen')) {
        alert(`"${data.text}" button clicked!`);
      } else {
        e.stopPropagation();
        document.querySelectorAll('.selectable').forEach(el => el.classList.remove('selected'));
        btn.classList.add('selected');
        selectedElement = btn;
      }
    };
    document.getElementById('actual-canvas').appendChild(btn);
    pages[currentPage].push(btn);
  });
}


function handleButtonAction(label) {
  switch (label) {
    case 'Next Level':
      alert('This is the Next Level button!');
      break;
    case 'Main Menu':
      alert('This is the Main Menu button!');
      break;
    case 'Settings':
      alert('This is the Settings button!');
      break;
    case 'Play Game':
      alert('This is the Play Game button!');
      break;
    case 'Help':
      alert('This is the Help button!');
      break;
    case 'Credits':
      alert('This is the Credits button!');
      break;
    case 'Hint':
      alert('This is the Hint button!');
      break;
    case 'Skip Level':
      alert('This is the Skip Level button!');
      break;
    case 'Inventory':
      alert('This is the Inventory button!');
      break;
    case 'Options':
      alert('This is the Options button!');
      break;
    case 'Exit Game':
      alert('This is the Exit Game button!');
      break;
    default:
      alert(`This is the ${label} button!`);
  }
}


function addPredefinedButton(label) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.classList.add('selectable', 'selectable-button');
  btn.style.position = 'absolute';
  btn.style.top = '20%';
  btn.style.left = '20%';
  btn.style.transform = 'scale(1) rotate(0deg)';
  btn.style.padding = '10px 20px';
  btn.style.borderRadius = '12px';
  btn.style.background = '#008fb8';
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.cursor = 'pointer';
  btn.style.fontSize = '16px';

  // Assign function for preview mode
  btn.onclick = (e) => {
    if (document.body.classList.contains('preview-fullscreen')) {
      handleButtonAction(label);
    } else {
      e.stopPropagation();
      document.querySelectorAll('.selectable').forEach(el => el.classList.remove('selected'));
      btn.classList.add('selected');
      selectedElement = btn;
    }
  };

  document.getElementById('actual-canvas').appendChild(btn);
  pages[currentPage].push(btn);
}