function previewGame() {
  inPreviewMode = true;
  document.body.classList.add('in-preview-mode');
  document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
  selectedElement = null;
  document.body.classList.add('preview-fullscreen');
  document.getElementById('left-box').style.display = 'none';
  document.getElementById('bottom-bar').style.display = 'none';
  document.getElementById('corner-box').style.display = 'none';

  document.querySelectorAll('#actual-canvas img').forEach(img => {
    delete img.dataset.previewHandled;
  });

  const config = pages[currentPage]?.meta?.textboxConfig || {};
  const assignedNames = config.assignedNames || [];
  remainingAssignedImages = assignedNames.length;

  const canvas = document.getElementById('actual-canvas');
  const allTextboxes = [...document.querySelectorAll('.textbox-item')];
  const linkedMap = new Map();

  allTextboxes.forEach(box => {
    const linked = box.getAttribute('data-linkedname');
    if (linked) linkedMap.set(linked, box);
  });

  canvas.querySelectorAll('img').forEach(img => {
    const name = img.dataset.name;
    if (!name || !assignedNames.includes(name)) return;
    if (img.classList.contains('game-button') || img.id === 'next-button') return;
    if (img.dataset.previewHandled) return;

    img.dataset.previewHandled = "true";

    img.addEventListener('click', function (e) {
      if (!inPreviewMode) return;

const validTextbox = [...document.querySelectorAll('.textbox-item')]
  .find(el => {
    const linked = el.getAttribute('data-linkedname');
    return linked && linked !== 'none' && linked === name;
  });
if (!validTextbox) return;

      isClickOnOpaquePixel(img, e, () => {
        const imageAnim = config.imageAnimation;

        if (imageAnim === 'anim1') {
const offsetX = img.offsetLeft;
  const offsetY = img.offsetTop;

  const computed = window.getComputedStyle(img);
  const matrix = new DOMMatrix(computed.transform);
  const currentScale = Math.hypot(matrix.a, matrix.b);
  const currentRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI) || 0;

  const clone = img.cloneNode(true);
  clone.removeAttribute('id');
  clone.dataset.previewClone = 'true';
  Object.assign(clone.style, {
    position: 'absolute',
    left: `${offsetX}px`,
    top: `${offsetY}px`,
    margin: '0',
    width: computed.width,
    height: computed.height,
    transform: `rotate(${currentRotation}deg) scale(${currentScale})`,
    transformOrigin: 'center center',
    opacity: '1',
    pointerEvents: 'none',
    zIndex: '9999',
  });
  canvas.appendChild(clone);
  img.style.display = 'none';

  // Particles
  const rect = clone.getBoundingClientRect();
const canvasRect = canvas.getBoundingClientRect();
const scrollX = window.scrollX;
const scrollY = window.scrollY;
const baseX = rect.left + scrollX - canvasRect.left;
const baseY = rect.top + scrollY - canvasRect.top;

const sparkleInterval = setInterval(() => {
  const px = baseX + Math.random() * rect.width;
  const py = baseY + Math.random() * rect.height;
    const particle = document.createElement('div');
    Object.assign(particle.style, {
      position: 'absolute',
      left: `${px}px`,
      top: `${py}px`,
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: 'gold',
      boxShadow: '0 0 8px 3px gold',
      opacity: '1',
      pointerEvents: 'none',
      zIndex: '9999',
      transition: 'transform 0.6s ease, opacity 0.6s ease'
    });

    canvas.appendChild(particle);

    requestAnimationFrame(() => {
      const angle = Math.random() * Math.PI * 2;
      const dx = Math.cos(angle) * 30;
      const dy = Math.sin(angle) * 30;
      particle.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
      particle.style.opacity = '0';
    });

    setTimeout(() => particle.remove(), 600);
  }, 50);

  setTimeout(() => clearInterval(sparkleInterval), 1500);

  // Bobbing then shrink-spin
  let bobState = true;
  let bobCount = 0;
  const maxBobs = 6;
  const bobInterval = setInterval(() => {
    clone.style.transition = 'transform 0.15s ease';
    const scale = bobState ? currentScale * 1.05 : currentScale * 0.95;
    clone.style.transform = `rotate(${currentRotation}deg) scale(${scale})`;
    bobState = !bobState;
    bobCount++;
    if (bobCount >= maxBobs) {
  clearInterval(bobInterval);
  clone.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
  clone.style.transform = `rotate(${currentRotation + 720}deg) scale(0.1)`;
  clone.style.opacity = '0';
  setTimeout(() => clone.remove(), 800);
}
  }, 120);
}

        else if (imageAnim === 'fade') {
 const offsetX = img.offsetLeft;
const offsetY = img.offsetTop;

const computed = window.getComputedStyle(img);

const clone = img.cloneNode(true);
clone.removeAttribute('id');
clone.dataset.previewClone = 'true';
Object.assign(clone.style, {
  position: 'absolute',
  left: `${offsetX}px`,
  top: `${offsetY}px`,
  margin: '0',
  width: computed.width,
  height: computed.height,
  transform: computed.transform,
  transformOrigin: 'center center',
  opacity: '1',
  pointerEvents: 'none',
  zIndex: '9999',
  transition: 'opacity 0.8s ease'
});
canvas.appendChild(clone);
img.style.display = 'none';

// Particles
const rect = clone.getBoundingClientRect();
const canvasRect = canvas.getBoundingClientRect();
const scrollX = window.scrollX;
const scrollY = window.scrollY;
const baseX = rect.left + scrollX - canvasRect.left;
const baseY = rect.top + scrollY - canvasRect.top;

const sparkleInterval = setInterval(() => {
  const px = baseX + Math.random() * rect.width;
  const py = baseY + Math.random() * rect.height;
  const particle = document.createElement('div');
  Object.assign(particle.style, {
    position: 'absolute',
    left: `${px}px`,
    top: `${py}px`,
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'gold',
    boxShadow: '0 0 8px 3px gold',
    opacity: '1',
    pointerEvents: 'none',
    zIndex: '9999',
    transition: 'transform 0.6s ease, opacity 0.6s ease'
  });

  canvas.appendChild(particle);

  requestAnimationFrame(() => {
    const angle = Math.random() * Math.PI * 2;
    const dx = Math.cos(angle) * 30;
    const dy = Math.sin(angle) * 30;
    particle.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
    particle.style.opacity = '0';
  });

  setTimeout(() => particle.remove(), 600);
}, 50);

setTimeout(() => clearInterval(sparkleInterval), 1500);

// Just fade the image
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    clone.style.opacity = '0';
  });
});
setTimeout(() => clone.remove(), 800);
        }
        
        
       else if (imageAnim === 'customanim') {
  try {
    let code = gameData.pages[pageNum]?.config?.imageCustomCode || '';
    code = code.replace(/\bel\b/g, 'img'); // Replace 'el' with 'img'
    new Function('img', code)(img);
  } catch (err) {
    console.warn('Error in custom image animation:', err);
    runfade(img); // fallback
  }
}
        
        
        else if (imageAnim === 'anim2') {
const offsetX = img.offsetLeft;
const offsetY = img.offsetTop;

const computed = window.getComputedStyle(img);
const matrix = new DOMMatrix(computed.transform);
const currentScale = Math.hypot(matrix.a, matrix.b);
const currentRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI) || 0;

const clone = img.cloneNode(true);
clone.removeAttribute('id');
clone.dataset.previewClone = 'true';
Object.assign(clone.style, {
  position: 'absolute',
  left: `${offsetX}px`,
  top: `${offsetY}px`,
  margin: '0',
  width: computed.width,
  height: computed.height,
  transform: `rotate(${currentRotation}deg) scale(${currentScale})`,
  transformOrigin: 'center center',
  opacity: '1',
  pointerEvents: 'none',
  zIndex: '9999',
});
canvas.appendChild(clone);
img.style.display = 'none';

// Particles
const rect = clone.getBoundingClientRect();
const canvasRect = canvas.getBoundingClientRect();
const scrollX = window.scrollX;
const scrollY = window.scrollY;
const baseX = rect.left + scrollX - canvasRect.left;
const baseY = rect.top + scrollY - canvasRect.top;

const sparkleInterval = setInterval(() => {
  const px = baseX + Math.random() * rect.width;
  const py = baseY + Math.random() * rect.height;
  const particle = document.createElement('div');
  Object.assign(particle.style, {
    position: 'absolute',
    left: `${px}px`,
    top: `${py}px`,
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'gold',
    boxShadow: '0 0 8px 3px gold',
    opacity: '1',
    pointerEvents: 'none',
    zIndex: '9999',
    transition: 'transform 0.6s ease, opacity 0.6s ease'
  });

  canvas.appendChild(particle);

  requestAnimationFrame(() => {
    const angle = Math.random() * Math.PI * 2;
    const dx = Math.cos(angle) * 30;
    const dy = Math.sin(angle) * 30;
    particle.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
    particle.style.opacity = '0';
  });

  setTimeout(() => particle.remove(), 600);
}, 50);

setTimeout(() => clearInterval(sparkleInterval), 1500);

// Bobbing then move-shrink-spin-fade
let bobState = true;
let bobCount = 0;
const maxBobs = 6;
const bobInterval = setInterval(() => {
  clone.style.transition = 'transform 0.15s ease';
  const scale = bobState ? currentScale * 1.05 : currentScale * 0.95;
  clone.style.transform = `rotate(${currentRotation}deg) scale(${scale})`;
  bobState = !bobState;
  bobCount++;
  if (bobCount >= maxBobs) {
    clearInterval(bobInterval);

    const pageBounds = document.body.getBoundingClientRect();
    const cloneBounds = clone.getBoundingClientRect();
    const targetX = (pageBounds.width - cloneBounds.width) / 2;
    const targetY = pageBounds.height - cloneBounds.height;

    clone.style.transition = 'left 0.8s ease, top 0.8s ease, transform 0.8s ease, opacity 0.8s ease';
    clone.style.left = `${targetX}px`;
    clone.style.top = `${targetY}px`;
    clone.style.transform = `rotate(${currentRotation + 720}deg) scale(0.1)`;
    clone.style.opacity = '0';

    setTimeout(() => clone.remove(), 800);
  }
}, 120);
}

        const textboxAnim = config.textboxAnimation;
document.querySelectorAll('.textbox-item').forEach(box => {
  if (
    box.dataset.linkedname === name &&
    pages[currentPage]?.meta?.textboxConfig?.assignedNames?.includes(name)
  ) {
    box.dataset.wasVisible = 'true'; // mark as affected textbox
    

    if (textboxAnim === 'fade') {
      box.style.transition = 'opacity 0.6s ease';
      box.offsetHeight;
      box.style.opacity = '0';
    } else if (textboxAnim === 'shade') {
      box.style.background = 'rgba(0, 0, 0, 0.5)';
    } else if (textboxAnim === 'cross') {
      box.style.textDecoration = 'line-through';
      box.style.opacity = '0.6';
    }

    // Always hide the box after animating
    setTimeout(() => {
      box.style.visibility = 'hidden';
    }, 600);
  }
});

        remainingAssignedImages--;
        if (remainingAssignedImages === 0) {
          document.getElementById('next-button')?.style?.setProperty('display', 'block');
        }
      });
    });
  });
document.querySelectorAll('.textbox-item').forEach(box => {
  if (!box.dataset.linkedname) return;

  box.addEventListener('click', function () {
    if (!inPreviewMode) return;
    const linkedName = box.dataset.linkedname;
    const matchingImage = document.querySelector(`img[data-name="${linkedName}"]`);
    const previewBox = document.querySelector('[data-box-type="imagePreview"]');

    if (matchingImage && previewBox) {
      const filepath = matchingImage.dataset.dataurl || matchingImage.src;

      // Fade out and remove old image
const oldImg = previewBox.querySelector('img');
if (oldImg) {
  oldImg.remove(); // Immediately remove old image
}

      // Create new image with effect
      const img = new Image();
      img.src = filepath;
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
          filter: 'drop-shadow(4px 4px 12px rgba(0,0,0,0.9))',
          opacity: '0',
          transition: 'opacity 0.4s ease'
        });

        previewBox.appendChild(resultImg);
        requestAnimationFrame(() => {
          resultImg.style.opacity = '1';
        });
      };
    }
  });
});


  startMusicForCurrentPage();
  const cursorImgSrc = localStorage.getItem('cursorImage');
const cursorSize = parseFloat(localStorage.getItem('cursorSize') || '100');

if (cursorImgSrc) {
  const img = new Image();
  img.src = cursorImgSrc;
  img.onload = () => {
    const canvas = document.getElementById('actual-canvas');
    const cursor = document.createElement('img');
    cursor.src = cursorImgSrc;
    cursor.id = 'preview-cursor';
    cursor.style.position = 'fixed';
    cursor.style.zIndex = '100000';
    cursor.style.pointerEvents = 'none';
    cursor.style.width = cursorSize * 0.3 + 'px'; // scale 100% = 30px
    cursor.style.height = 'auto';
    document.body.appendChild(cursor);

    // find top-left non-transparent pixel
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const imageData = ctx.getImageData(0, 0, img.width, img.height).data;

    let offsetX = 0, offsetY = 0;
    outer: for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const index = (y * img.width + x) * 4 + 3;
        if (imageData[index] > 0) {
          offsetX = x;
          offsetY = y;
          break outer;
        }
      }
    }

const scaledWidth = cursorSize * 0.3;
const scaleRatio = scaledWidth / img.width;

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
if (cursorImgSrc) {
  document.body.setAttribute('data-has-cursor-image', 'true');
} else {
  document.body.removeAttribute('data-has-cursor-image');
}
}

function exitPreview() {
  inPreviewMode = false;
  const oldCursor = document.getElementById('preview-cursor');
if (oldCursor) oldCursor.remove();
document.body.style.cursor = ''; // restore default
  document.body.classList.remove('in-preview-mode');
  stopAllMusic();
  document.body.classList.remove('preview-fullscreen');
  document.getElementById('left-box').style.display = '';
  document.getElementById('bottom-bar').style.display = '';
  document.getElementById('corner-box').style.display = '';

  // Reset and show all images
  document.querySelectorAll('.textbox-item').forEach(box => {
  if (box.dataset.wasVisible) {
  box.style.opacity = '1';
  box.style.visibility = 'visible';
}
});
  document.querySelectorAll('#actual-canvas img').forEach(img => {
    img.style.display = '';
    img.style.opacity = '1';

    // ✅ Reset only rotation, preserve scale
    if (img.dataset.originalTransform) {
  img.style.transform = img.dataset.originalTransform;
  delete img.dataset.originalTransform;
}


    delete img.dataset.previewHandled;
  });

  // Rebuild textbox container
  const config = pages[currentPage]?.meta?.textboxConfig;
  if (config) {
    createTextboxContainerAdvanced(config);
  }
  

  // Hide next button
  document.getElementById('next-button')?.style?.setProperty('display', 'none');
}



function startMusicForCurrentPage() {
  stopAllMusic();

  const config = pages[currentPage]?.meta?.musicConfig;
  if (!config || !config.tracks?.length) return;

  const tracks = config.tracks;
  const spacing = parseInt(config.spacing || "0") * 1000;
  let index = 0;

  function playTrack(i) {
    if (!tracks[i]) return;
    const audio = new Audio(tracks[i].dataURL);
    window.currentPageAudio = audio;
    audio.volume = 1;
    audio.play();

    audio.onended = () => {
      setTimeout(() => {
        index = (index + 1) % tracks.length;
        playTrack(index);
      }, spacing);
    };
  }

  playTrack(index);
}

function stopAllMusic() {
  if (window.currentPageAudio) {
    window.currentPageAudio.pause();
    window.currentPageAudio.currentTime = 0;
    window.currentPageAudio = null;
  }
}