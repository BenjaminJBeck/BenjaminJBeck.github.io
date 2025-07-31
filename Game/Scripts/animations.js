function runanim1(el) {
  const canvas = document.getElementById('canvas-wrapper');
  if (!canvas) return;
  
  const elRect = el.getBoundingClientRect();
  const computed = window.getComputedStyle(el);
  const matrix = new DOMMatrix(computed.transform);
  const baseScale = Math.hypot(matrix.a, matrix.b);
  const baseRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI) || 0;
  
  // Sparkles
  for (let i = 0; i < 12; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${elRect.left + Math.random() * elRect.width}px`;
    sparkle.style.top = `${elRect.top + Math.random() * elRect.height}px`;
    sparkle.style.width = '6px';
    sparkle.style.height = '6px';
    sparkle.style.borderRadius = '50%';
    sparkle.style.background = 'gold';
    sparkle.style.boxShadow = '0 0 8px 3px gold';
    sparkle.style.opacity = '1';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    document.body.appendChild(sparkle);
    
    requestAnimationFrame(() => {
      const angle = Math.random() * Math.PI * 2;
      const dx = Math.cos(angle) * 30;
      const dy = Math.sin(angle) * 30;
      sparkle.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
      sparkle.style.opacity = '0';
    });
    
    setTimeout(() => sparkle.remove(), 600);
  }
  
  // Bobbing animation
  let bobState = true;
  let bobCount = 0;
  const maxBobs = 6;
  const bobInterval = setInterval(() => {
    el.style.transition = 'transform 0.15s ease';
    const newScale = bobState ? baseScale * 1.05 : baseScale * 0.95;
    el.style.transform = `rotate(${baseRotation}deg) scale(${newScale})`;
    bobState = !bobState;
    bobCount++;
    if (bobCount >= maxBobs) {
      clearInterval(bobInterval);
      el.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
      el.style.transform = `rotate(${baseRotation + 720}deg) scale(0.1)`;
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 800);
    }
  }, 120);
}



function runfade(el) {
const canvas = document.getElementById('canvas-wrapper');
if (!canvas) return;

const elRect = el.getBoundingClientRect();

// Sparkles
for (let i = 0; i < 12; i++) {
  const sparkle = document.createElement('div');
  sparkle.style.position = 'fixed';
  sparkle.style.left = `${elRect.left + Math.random() * elRect.width}px`;
  sparkle.style.top = `${elRect.top + Math.random() * elRect.height}px`;
  sparkle.style.width = '6px';
  sparkle.style.height = '6px';
  sparkle.style.borderRadius = '50%';
  sparkle.style.background = 'gold';
  sparkle.style.boxShadow = '0 0 8px 3px gold';
  sparkle.style.opacity = '1';
  sparkle.style.pointerEvents = 'none';
  sparkle.style.zIndex = '9999';
  sparkle.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
  document.body.appendChild(sparkle);
  
  requestAnimationFrame(() => {
    const angle = Math.random() * Math.PI * 2;
    const dx = Math.cos(angle) * 30;
    const dy = Math.sin(angle) * 30;
    sparkle.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
    sparkle.style.opacity = '0';
  });
  
  setTimeout(() => sparkle.remove(), 600);
}

// Just fade out the element slower
el.style.transition = 'opacity 1.2s ease';
el.style.opacity = '0';
setTimeout(() => el.remove(), 1200);
}



function runanim2(el) {
  const canvas = document.getElementById('canvas-wrapper');
if (!canvas) return;

const elRect = el.getBoundingClientRect();
const computed = window.getComputedStyle(el);
const matrix = new DOMMatrix(computed.transform);
const baseScale = Math.hypot(matrix.a, matrix.b);
const baseRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI) || 0;

let sparkleInterval = setInterval(() => {
  const count = 2; // sparkles per burst
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'absolute';
    sparkle.style.width = '6px';
    sparkle.style.height = '6px';
    sparkle.style.borderRadius = '50%';
    sparkle.style.background = 'gold';
    sparkle.style.boxShadow = '0 0 8px 3px gold';
    sparkle.style.opacity = '1';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';

    const offsetX = Math.random() * el.offsetWidth;
    const offsetY = Math.random() * el.offsetHeight;
    sparkle.style.left = `${el.offsetLeft + offsetX}px`;
    sparkle.style.top = `${el.offsetTop + offsetY}px`;

    canvas.appendChild(sparkle);

    // Animate sparkle
    const angle = Math.random() * Math.PI * 2;
    const dx = Math.cos(angle) * 30;
    const dy = Math.sin(angle) * 30;
    requestAnimationFrame(() => {
      sparkle.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
      sparkle.style.transform = `translate(${dx}px, ${dy}px) scale(0.6)`;
      sparkle.style.opacity = '0';
    });

    setTimeout(() => sparkle.remove(), 600);
  }
}, 80);

// Bobbing animation
let bobState = true;
let bobCount = 0;
const maxBobs = 11;

const bobInterval = setInterval(() => {
  el.style.transition = 'transform 0.15s ease';
  const newScale = bobState ? baseScale * 1.05 : baseScale * 0.95;
  el.style.transform = `rotate(${baseRotation}deg) scale(${newScale})`;
  bobState = !bobState;
  bobCount++;
  if (bobCount >= maxBobs) {
    clearInterval(bobInterval);
    clearInterval(sparkleInterval);

    const elWidth = el.offsetWidth;
    const elHeight = el.offsetHeight;
    const centerX = (canvas.offsetWidth - elWidth) / 2;
    const bottomY = canvas.offsetHeight - elHeight;

    el.style.transition = 'left 0.8s ease, top 0.8s ease, transform 0.8s ease, opacity 0.8s ease';
    el.style.left = `${centerX}px`;
    el.style.top = `${bottomY}px`;
    el.style.transform = `rotate(${baseRotation + 720}deg) scale(0.1)`;
    el.style.opacity = '0';

    setTimeout(() => el.remove(), 800);
  }
}, 120);
}