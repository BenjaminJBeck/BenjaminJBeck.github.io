let selectedElement = null;
let interactionMode = null; // 'move' | 'scale' | 'rotate'
let isMouseDown = false;
let resizing = false;
let resizeSide = null;
let copiedElement = null;
let startX, startY, startWidth, startHeight, startLeft, startTop;
let initialMouseX = 0;
let initialMouseY = 0;
let initialScale = 1;
let initialRotation = 0;
let initialDistance = 0;
let initialAngle = 0;
let isCtrlPressed = false;
let rotationDisplay = null;

// Zoom and pan variables
const ZOOM_CONFIG = {
  min: 0.1,
  max: 10,
  step: 0.1,
  keyboardStep: 0.2,
  sensitivity: 0.001,
  smoothness: 0.15
};

let canvasZoom = 1;
let canvasPanX = 0;
let canvasPanY = 0;
let isPanning = false;
let lastPanX = 0;
let lastPanY = 0;
let zoomIndicatorTimeout;
let isPanningWithMiddle = false;
let isPanningWithRight = false;

// Function to create Canva-style selection box
function createCanvaSelectionBox(element) {
  // Remove any existing selection box
  removeCanvaSelectionBox();
  
  const canvas = document.getElementById("actual-canvas");
  const canvasRect = canvas.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  
  // Create the main selection container
  const selectionBox = document.createElement('div');
  selectionBox.className = 'canva-selection-box';
  selectionBox.style.position = 'absolute';
  selectionBox.style.pointerEvents = 'none';
  selectionBox.style.zIndex = '9999';
  
  // Position relative to canvas
  const left = elementRect.left - canvasRect.left;
  const top = elementRect.top - canvasRect.top;
  const width = elementRect.width;
  const height = elementRect.height;
  
  selectionBox.style.left = left + 'px';
  selectionBox.style.top = top + 'px';
  selectionBox.style.width = width + 'px';
  selectionBox.style.height = height + 'px';
  
  // Create the four border lines
  const lineStyle = {
    position: 'absolute',
    backgroundColor: '#4a90e2',
    boxShadow: '0 0 4px rgba(74, 144, 226, 0.6)'
  };
  
  // Top line
  const topLine = document.createElement('div');
  Object.assign(topLine.style, lineStyle, {
    top: '-2px',
    left: '-2px',
    right: '-2px',
    height: '2px'
  });
  
  // Bottom line
  const bottomLine = document.createElement('div');
  Object.assign(bottomLine.style, lineStyle, {
    bottom: '-2px',
    left: '-2px',
    right: '-2px',
    height: '2px'
  });
  
  // Left line
  const leftLine = document.createElement('div');
  Object.assign(leftLine.style, lineStyle, {
    top: '-2px',
    bottom: '-2px',
    left: '-2px',
    width: '2px'
  });
  
  // Right line
  const rightLine = document.createElement('div');
  Object.assign(rightLine.style, lineStyle, {
    top: '-2px',
    bottom: '-2px',
    right: '-2px',
    width: '2px'
  });
  
  // Add corner handles for visual feedback
  const cornerSize = 8;
  const cornerStyle = {
    position: 'absolute',
    width: cornerSize + 'px',
    height: cornerSize + 'px',
    backgroundColor: '#4a90e2',
    border: '1px solid white',
    borderRadius: '2px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
  };
  
  // Top-left corner
  const topLeftCorner = document.createElement('div');
  Object.assign(topLeftCorner.style, cornerStyle, {
    top: (-cornerSize / 2) + 'px',
    left: (-cornerSize / 2) + 'px'
  });
  
  // Top-right corner
  const topRightCorner = document.createElement('div');
  Object.assign(topRightCorner.style, cornerStyle, {
    top: (-cornerSize / 2) + 'px',
    right: (-cornerSize / 2) + 'px'
  });
  
  // Bottom-left corner
  const bottomLeftCorner = document.createElement('div');
  Object.assign(bottomLeftCorner.style, cornerStyle, {
    bottom: (-cornerSize / 2) + 'px',
    left: (-cornerSize / 2) + 'px'
  });
  
  // Bottom-right corner
  const bottomRightCorner = document.createElement('div');
  Object.assign(bottomRightCorner.style, cornerStyle, {
    bottom: (-cornerSize / 2) + 'px',
    right: (-cornerSize / 2) + 'px'
  });
  
  // Append all elements
  selectionBox.appendChild(topLine);
  selectionBox.appendChild(bottomLine);
  selectionBox.appendChild(leftLine);
  selectionBox.appendChild(rightLine);
  selectionBox.appendChild(topLeftCorner);
  selectionBox.appendChild(topRightCorner);
  selectionBox.appendChild(bottomLeftCorner);
  selectionBox.appendChild(bottomRightCorner);
  
  canvas.appendChild(selectionBox);
  
  return selectionBox;
}

// Function to update Canva selection box position and size
function updateCanvaSelectionBox(element) {
  const selectionBox = document.querySelector('.canva-selection-box');
  if (!selectionBox || !element) return;
  
  const canvas = document.getElementById("actual-canvas");
  const canvasRect = canvas.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  
  // Update position and size
  const left = elementRect.left - canvasRect.left;
  const top = elementRect.top - canvasRect.top;
  const width = elementRect.width;
  const height = elementRect.height;
  
  selectionBox.style.left = left + 'px';
  selectionBox.style.top = top + 'px';
  selectionBox.style.width = width + 'px';
  selectionBox.style.height = height + 'px';
}

// Function to remove Canva selection box
function removeCanvaSelectionBox() {
  const selectionBox = document.querySelector('.canva-selection-box');
  if (selectionBox) {
    selectionBox.remove();
  }
}

// Updated function to update selection visual based on scale (now uses Canva-style)
function updateSelectionVisual(element) {
  if (!element) return;
  updateCanvaSelectionBox(element);
}

// Updated function to clear custom selection styling
function clearSelectionVisual(element) {
  removeCanvaSelectionBox();
}

function showRotationDisplay(element, rotation) {
  if (rotationDisplay) rotationDisplay.remove();
  
  rotationDisplay = document.createElement('div');
  rotationDisplay.style.position = 'absolute';
  rotationDisplay.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  rotationDisplay.style.color = 'white';
  rotationDisplay.style.padding = '8px 16px';
  rotationDisplay.style.borderRadius = '20px';
  rotationDisplay.style.fontSize = '14px';
  rotationDisplay.style.fontWeight = '600';
  rotationDisplay.style.zIndex = '10000';
  rotationDisplay.style.pointerEvents = 'none';
  rotationDisplay.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
  rotationDisplay.style.border = '1px solid rgba(255, 255, 255, 0.2)';
  rotationDisplay.style.backdropFilter = 'blur(10px)';
  rotationDisplay.textContent = `${Math.round(rotation)}°`;
  
  const rect = element.getBoundingClientRect();
  rotationDisplay.style.left = (rect.left + rect.width / 2 - 30) + 'px';
  rotationDisplay.style.top = (rect.top - 50) + 'px';
  
  document.body.appendChild(rotationDisplay);
}

function hideRotationDisplay() {
  if (rotationDisplay) {
    rotationDisplay.remove();
    rotationDisplay = null;
  }
}

function snapToInterval(angle, interval = 15) {
  return Math.round(angle / interval) * interval;
}

function clearGuides() {
  document.querySelectorAll('.guide-line').forEach(g => g.remove());
}

function showGuideLine(x, y) {
  const canvas = document.getElementById("actual-canvas");
  const canvasRect = canvas.getBoundingClientRect();
  
  if (y !== null) {
    const h = document.createElement("div");
    h.className = "guide-line h";
    h.style.top = ((y - canvasRect.top) / canvasRect.height) * 100 + "%";
    canvas.appendChild(h);
  }
  if (x !== null) {
    const v = document.createElement("div");
    v.className = "guide-line v";
    v.style.left = ((x - canvasRect.left) / canvasRect.width) * 100 + "%";
    canvas.appendChild(v);
  }
}

function getScale(el) {
  const match = el.style.transform.match(/scale\(([^)]+)\)/);
return match ? parseFloat(match[1]) : 1;
}

function getRotation(el) {
  const match = el.style.transform.match(/rotate\(([^)]+)deg\)/);
return match ? parseFloat(match[1]) : 0;
}

function addResizeBars(el) {
  removeResizeBars();
  const sides = ['top', 'right', 'bottom', 'left'];
  sides.forEach(side => {
    const bar = document.createElement('div');
    bar.className = `resize-bar resize-${side}`;
    bar.dataset.side = side;
    el.appendChild(bar);
  });
}

function removeResizeBars() {
  document.querySelectorAll('.resize-bar').forEach(bar => bar.remove());
}

function isSnappableElement(el) {
  if (el.tagName === 'IMG' || el.classList.contains('image-preview')) return false;
  return el.classList.contains('selectable') || 
    el.classList.contains('selectable-button') ||
    el.classList.contains('selectable-textbox');
}

function applySnapGuides(selectedElement) {
  clearGuides();
  const canvas = document.getElementById('actual-canvas');
  const canvasRect = canvas.getBoundingClientRect();
  const get = (el, prop) => parseFloat(el.style[prop] || 0);
  
  const b1 = {
    top: get(selectedElement, 'top'),
    left: get(selectedElement, 'left'),
    width: get(selectedElement, 'width'),
    height: get(selectedElement, 'height'),
  };
  
  const cX1 = b1.left + b1.width / 2;
  const cY1 = b1.top + b1.height / 2;
  const threshold = 0.5;
  let snapped = false;
  
  const canvasCenterX = 50;
  const canvasCenterY = 50;
  
  if (Math.abs(cX1 - canvasCenterX) < threshold) {
    selectedElement.style.left = (canvasCenterX - b1.width / 2) + "%";
    showGuideLine(canvasRect.left + canvasRect.width / 2, null);
    snapped = true;
  }
  if (Math.abs(cY1 - canvasCenterY) < threshold) {
    selectedElement.style.top = (canvasCenterY - b1.height / 2) + "%";
    showGuideLine(null, canvasRect.top + canvasRect.height / 2);
    snapped = true;
  }
  
  document.querySelectorAll('#actual-canvas *').forEach(otherEl => {
    if (otherEl === selectedElement || !isSnappableElement(otherEl)) return;
    
    const b2 = {
      top: get(otherEl, 'top'),
      left: get(otherEl, 'left'),
      width: get(otherEl, 'width'),
      height: get(otherEl, 'height'),
    };
    
    const cX2 = b2.left + b2.width / 2;
    const cY2 = b2.top + b2.height / 2;
    const rect2 = otherEl.getBoundingClientRect();
    const rCenterX = rect2.left + rect2.width / 2;
    const rCenterY = rect2.top + rect2.height / 2;
    
    if (Math.abs(b1.left - b2.left) < threshold) {
      selectedElement.style.left = b2.left + "%";
      showGuideLine(rect2.left, null);
      snapped = true;
    }
    if (Math.abs(b1.left + b1.width - (b2.left + b2.width)) < threshold) {
      selectedElement.style.left = (b2.left + b2.width - b1.width) + "%";
      showGuideLine(rect2.right, null);
      snapped = true;
    }
    if (Math.abs(cX1 - cX2) < threshold) {
      selectedElement.style.left = (cX2 - b1.width / 2) + "%";
      showGuideLine(rCenterX, null);
      snapped = true;
    }
    
    if (Math.abs(b1.top - b2.top) < threshold) {
      selectedElement.style.top = b2.top + "%";
      showGuideLine(null, rect2.top);
      snapped = true;
    }
    if (Math.abs(b1.top + b1.height - (b2.top + b2.height)) < threshold) {
      selectedElement.style.top = (b2.top + b2.height - b1.height) + "%";
      showGuideLine(null, rect2.bottom);
      snapped = true;
    }
    if (Math.abs(cY1 - cY2) < threshold) {
      selectedElement.style.top = (cY2 - b1.height / 2) + "%";
      showGuideLine(null, rCenterY);
      snapped = true;
    }
    
    if (Math.abs(b1.left + b1.width - b2.left) < threshold) {
      selectedElement.style.left = (b2.left - b1.width) + "%";
      showGuideLine(rect2.left, null);
      snapped = true;
    }
    if (Math.abs(b1.left - (b2.left + b2.width)) < threshold) {
      selectedElement.style.left = (b2.left + b2.width) + "%";
      showGuideLine(rect2.right, null);
      snapped = true;
    }
    if (Math.abs(b1.top + b1.height - b2.top) < threshold) {
      selectedElement.style.top = (b2.top - b1.height) + "%";
      showGuideLine(null, rect2.top);
      snapped = true;
    }
    if (Math.abs(b1.top - (b2.top + b2.height)) < threshold) {
      selectedElement.style.top = (b2.top + b2.height) + "%";
      showGuideLine(null, rect2.bottom);
      snapped = true;
    }
  });
}

function clampZoom(zoom) {
  return Math.max(ZOOM_CONFIG.min, Math.min(ZOOM_CONFIG.max, zoom));
}

function showZoomIndicator() {
  const indicator = document.getElementById('zoom-indicator');
  indicator.textContent = Math.round(canvasZoom * 100) + '%';
  indicator.style.opacity = '1';
  
  clearTimeout(zoomIndicatorTimeout);
  zoomIndicatorTimeout = setTimeout(() => {
    indicator.style.opacity = '0';
  }, 1500);
}

function updateCanvasTransform(smooth = true) {
  const canvasWrapper = document.getElementById('canvas-wrapper');
  if (canvasWrapper) {
    canvasWrapper.style.transformOrigin = '0 0';
    canvasWrapper.style.transition = smooth ? `transform ${ZOOM_CONFIG.smoothness}s cubic-bezier(0.4, 0, 0.2, 1)` : 'none';
    canvasWrapper.style.transform = `translate(${canvasPanX}px, ${canvasPanY}px) scale(${canvasZoom})`;
  }
  showZoomIndicator();
}

function resetCanvasView() {
  canvasZoom = 1;
  canvasPanX = 0;
  canvasPanY = 0;
  updateCanvasTransform();
}

function zoomToPoint(mouseX, mouseY, newZoom, smooth = true) {
  const canvasPointX = (mouseX - canvasPanX) / canvasZoom;
  const canvasPointY = (mouseY - canvasPanY) / canvasZoom;
  
  canvasZoom = clampZoom(newZoom);
  
  canvasPanX = mouseX - (canvasPointX * canvasZoom);
  canvasPanY = mouseY - (canvasPointY * canvasZoom);
  
  updateCanvasTransform(smooth);
}

function zoomToFit() {
  const windowWidth = window.innerWidth - 170;
  const windowHeight = window.innerHeight - 100;
  const canvasWidth = 1365;
  const canvasHeight = window.innerHeight - 100;
  
  const scaleX = windowWidth / canvasWidth;
  const scaleY = windowHeight / canvasHeight;
  const optimalZoom = Math.min(scaleX, scaleY) * 0.9;
  
  canvasZoom = clampZoom(optimalZoom);
  canvasPanX = 0;
  canvasPanY = 0;
  updateCanvasTransform();
}

function addSelectionFrame(target) {
  removeSelectionFrame(); // Clear old

  selectedElement = target;
  
  // Create Canva-style selection box instead of the old frame
  createCanvaSelectionBox(target);
}

function removeSelectionFrame() {
  // Remove Canva-style selection box
  removeCanvaSelectionBox();
  
  // Clear custom selection styling from previously selected element
  if (selectedElement) {
    clearSelectionVisual(selectedElement);
  }
  
  selectedElement = null;
  removeResizeBars();
}

document.addEventListener("click", (e) => {
  if (inPreviewMode) {
    if (selectedElement) {
      removeSelectionFrame();
    }
    return;
  }

  if (justInteracted) return;

  // Always clear any existing selections
  document.querySelectorAll(".selected").forEach(el => {
    el.classList.remove("selected");
    clearSelectionVisual(el);
  });
  removeResizeBars();
  selectedElement = null;

  // Select new element if applicable
  if (isSnappableElement(e.target)) {
    selectedElement = e.target;
    selectedElement.classList.add("selected");
    addSelectionFrame(e.target);
    // Update visual styling for scaled elements
    updateSelectionVisual(selectedElement);
    e.stopPropagation();
  }
});

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  if (key === "escape") return; // Already handled in the other listener

  if (inPreviewMode) return;

  if (selectedElement) {
    if (key === "m") interactionMode = "move";
    if (key === "r") interactionMode = "rotate";
    if (key === "s") interactionMode = "scale";
  }

  if ((key === "delete" || key === "backspace") && selectedPageForDelete !== null) {
    saveState();
    deleteCurrentPage();
    return;
  }

  if (key === "delete" && selectedElement) {
    const popupVisible = document.getElementById("button-popup");
    if (!popupVisible || getComputedStyle(popupVisible).display === "none") {
      if (confirm("Do you want to delete this element?")) {
        saveState();
        const index = pages[currentPage].indexOf(selectedElement);
        if (index !== -1) pages[currentPage].splice(index, 1);
        selectedElement.remove();
        selectedElement = null;
        removeResizeBars();
      }
    }
  }

  if (e.ctrlKey && e.shiftKey && key === "z") {
    e.preventDefault();
    redoLastAction();
  } else if (e.ctrlKey && key === "z") {
    e.preventDefault();
    undoLastAction();
  }
});

document.getElementById("canvas-wrapper").addEventListener("click", function (e) {
  if (!justInteracted && (e.target.id === "canvas-wrapper" || e.target.id === "actual-canvas")) {
    document.querySelectorAll(".selectable").forEach((el) => {
      el.classList.remove("selected");
      clearSelectionVisual(el);
    });
    selectedElement = null;
    removeResizeBars();
  }
});

document.addEventListener("mousedown", function (e) {
  if (inPreviewMode) return;

  if (interactionMode === null && selectedElement && e.target === selectedElement) {
    interactionMode = "move";
  }

  if (!selectedElement || !["move", "scale", "rotate"].includes(interactionMode)) return;

  saveState();
  isMouseDown = true;
  justInteracted = true;
  
  // Store initial mouse position
  initialMouseX = e.clientX;
  initialMouseY = e.clientY;
  
  // Store initial element state for scaling and rotation
  if (interactionMode === "scale" || interactionMode === "rotate") {
    initialScale = getScale(selectedElement);
    initialRotation = getRotation(selectedElement);
    
    // Calculate initial distance and angle from element center
    const box = selectedElement.getBoundingClientRect();
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;
    
    initialDistance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    initialAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
  }
});

document.addEventListener("mouseup", function () {
  if (["move", "scale", "rotate"].includes(interactionMode)) {
    isMouseDown = false;
    interactionMode = null;
    clearGuides();
    hideRotationDisplay(); // Hide rotation display when done
    setTimeout(() => { justInteracted = false; }, 50);
  }
});

document.addEventListener("mousemove", function (e) {
  if (inPreviewMode) return;
  if (!selectedElement || !isMouseDown || !["move", "scale", "rotate"].includes(interactionMode)) return;
  
  const canvas = document.getElementById("actual-canvas");
  const rect = canvas.getBoundingClientRect();
  
  if (interactionMode === "move") {
    const el = selectedElement;
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;

    const offsetX = (e.movementX / canvasWidth) * 100;
    const offsetY = (e.movementY / canvasHeight) * 100;
    
    let currentLeft = parseFloat(el.style.left);
    let currentTop = parseFloat(el.style.top);

    if (isNaN(currentLeft) || isNaN(currentTop)) {
      const elRect = el.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      currentLeft = ((elRect.left - canvasRect.left) / canvasRect.width) * 100;
      currentTop = ((elRect.top - canvasRect.top) / canvasRect.height) * 100;
    }

    let newLeft = currentLeft + offsetX;
    let newTop = currentTop + offsetY;

// Get the current scale factor
const currentScale = getScale(el);

// Calculate the actual visual dimensions accounting for scale
const baseWidth = (el.offsetWidth / canvasWidth) * 100;
const baseHeight = (el.offsetHeight / canvasHeight) * 100;
const visualWidth = baseWidth * currentScale;
const visualHeight = baseHeight * currentScale;

// Calculate the offset caused by scaling from center (transform-origin: 50% 50%)
const scaleOffsetX = (baseWidth - visualWidth) / 2;
const scaleOffsetY = (baseHeight - visualHeight) / 2;

// Adjust the visual bounds accounting for scale offset
const visualLeft = newLeft + scaleOffsetX;
const visualTop = newTop + scaleOffsetY;
const visualRight = visualLeft + visualWidth;
const visualBottom = visualTop + visualHeight;

const snapThreshold = 1;

// Canvas edge snapping using visual bounds
if (Math.abs(visualLeft) < snapThreshold) {
  newLeft = -scaleOffsetX;
} else if (Math.abs(visualRight - 100) < snapThreshold) {
  newLeft = 100 - visualWidth - scaleOffsetX;
}

if (Math.abs(visualTop) < snapThreshold) {
  newTop = -scaleOffsetY;
} else if (Math.abs(visualBottom - 100) < snapThreshold) {
  newTop = 100 - visualHeight - scaleOffsetY;
}

    el.style.left = `${newLeft}%`;
    el.style.top = `${newTop}%`;
    
    // Update Canva selection box position
    updateCanvaSelectionBox(selectedElement);
    
    // Apply enhanced snapping (only if not an image)
    if (selectedElement.tagName !== 'IMG' && !selectedElement.classList.contains('image-preview')) {
      applySnapGuides(selectedElement);
    }
  }
  
  if (interactionMode === "scale") {
    const box = selectedElement.getBoundingClientRect();
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;
    
    // Calculate current distance from center
    const currentDistance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    
    // Calculate scale change based on distance change from initial
    const distanceChange = currentDistance - initialDistance;
    const scaleChange = distanceChange / 150; // Adjust sensitivity here
    const newScale = Math.max(0.05, initialScale + scaleChange);
    
    // Update transform and selection visual
    selectedElement.style.transform = `scale(${newScale}) rotate(${getRotation(selectedElement)}deg)`;
    updateSelectionVisual(selectedElement);
  }
  
if (interactionMode === "rotate") {
  const box = selectedElement.getBoundingClientRect();
  const centerX = box.left + box.width / 2;
  const centerY = box.top + box.height / 2;
  
  // Calculate current angle from center
  const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
  
  // Calculate rotation change from initial angle
  const angleChange = currentAngle - initialAngle;
  let newRotation = initialRotation + angleChange;
  
  // Apply snapping if Ctrl is held down
  if (isCtrlPressed) {
    newRotation = snapToInterval(newRotation, 15);
  }
  
  // Show rotation display
  showRotationDisplay(selectedElement, newRotation);
  
  selectedElement.style.transform = `rotate(${newRotation}deg) scale(${getScale(selectedElement)})`;
  updateSelectionVisual(selectedElement);
}
});

document.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("resize-bar")) {
    resizing = true;
    resizeSide = e.target.dataset.side;
    selectedElement = e.target.parentElement;
    e.preventDefault();

    saveState(); // Save state before resizing

    const rect = selectedElement.getBoundingClientRect();
    const canvasRect = document.getElementById("actual-canvas").getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startWidth = rect.width;
    startHeight = rect.height;
    startLeft = rect.left - canvasRect.left;
    startTop = rect.top - canvasRect.top;
    
    justInteracted = true;
  }
});

document.addEventListener("mouseup", () => {
  if (resizing) {
    resizing = false;
    clearGuides();
    setTimeout(() => { justInteracted = false; }, 50);
  }
  hideRotationDisplay(); // Also hide when resizing ends
  resizeSide = null;
});

document.addEventListener("mousemove", (e) => {
  if (!resizing || !selectedElement) return;

  const canvas = document.getElementById("actual-canvas");
  const canvasRect = canvas.getBoundingClientRect();
  const percent = (val, total) => (val / total) * 100;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  const applyScalingSnapGuides = () => {
    clearGuides();
    const get = (el, prop) => parseFloat(el.style[prop] || 0);
    const b1 = {
      top: get(selectedElement, 'top'),
      left: get(selectedElement, 'left'),
      width: get(selectedElement, 'width'),
      height: get(selectedElement, 'height'),
    };

    document.querySelectorAll('#actual-canvas *').forEach(otherEl => {
      if (otherEl === selectedElement || !isSnappableElement(otherEl)) return;

      const b2 = {
        top: get(otherEl, 'top'),
        left: get(otherEl, 'left'),
        width: get(otherEl, 'width'),
        height: get(otherEl, 'height'),
      };

      const cX1 = b1.left + b1.width / 2;
      const cX2 = b2.left + b2.width / 2;
      const cY1 = b1.top + b1.height / 2;
      const cY2 = b2.top + b2.height / 2;

      const rect2 = otherEl.getBoundingClientRect();
      const rCenterX = rect2.left + rect2.width / 2;
      const rCenterY = rect2.top + rect2.height / 2;
      const threshold = 0.5;

      // All the existing scaling snap logic...
      if (Math.abs(b1.left - b2.left) < threshold && resizeSide === "left") {
        const diff = b1.left - b2.left;
        selectedElement.style.left = b2.left + "%";
        selectedElement.style.width = (b1.width + diff) + "%";
        showGuideLine(rect2.left, null);
      }

      if (Math.abs(b1.left + b1.width - (b2.left + b2.width)) < threshold && resizeSide === "right") {
        selectedElement.style.width = (b2.left + b2.width - b1.left) + "%";
        showGuideLine(rect2.right, null);
      }

      if (Math.abs(cX1 - cX2) < threshold) {
        const diff = cX1 - cX2;
        if (resizeSide === "left") {
          selectedElement.style.left = (b1.left - diff) + "%";
          selectedElement.style.width = (b1.width + diff) + "%";
        } else if (resizeSide === "right") {
          selectedElement.style.width = (b1.width - diff) + "%";
        }
        showGuideLine(rCenterX, null);
      }

      if (Math.abs(b1.top - b2.top) < threshold && resizeSide === "top") {
        const diff = b1.top - b2.top;
        selectedElement.style.top = b2.top + "%";
        selectedElement.style.height = (b1.height + diff) + "%";
        showGuideLine(null, rect2.top);
      }

      if (Math.abs(b1.top + b1.height - (b2.top + b2.height)) < threshold && resizeSide === "bottom") {
        selectedElement.style.height = (b2.top + b2.height - b1.top) + "%";
        showGuideLine(null, rect2.bottom);
      }

      if (Math.abs(cY1 - cY2) < threshold) {
        const diff = cY1 - cY2;
        if (resizeSide === "top") {
          selectedElement.style.top = (b1.top - diff) + "%";
          selectedElement.style.height = (b1.height + diff) + "%";
        } else if (resizeSide === "bottom") {
          selectedElement.style.height = (b1.height - diff) + "%";
        }
        showGuideLine(null, rCenterY);
      }

      if (resizeSide === "left" && Math.abs(b1.left + b1.width - b2.left) < threshold) {
        selectedElement.style.width = (b2.left - b1.left) + "%";
        showGuideLine(rect2.left, null);
      }

      if (resizeSide === "top" && Math.abs(b1.top + b1.height - b2.top) < threshold) {
        selectedElement.style.height = (b2.top - b1.top) + "%";
        showGuideLine(null, rect2.top);
      }

      if (resizeSide === "left" && Math.abs(b1.left - (b2.left + b2.width)) < threshold) {
        const diff = b1.left - (b2.left + b2.width);
        selectedElement.style.left = (b2.left + b2.width) + "%";
        selectedElement.style.width = (b1.width + diff) + "%";
        showGuideLine(rect2.right, null);
      }

      if (resizeSide === "top" && Math.abs(b1.top - (b2.top + b2.height)) < threshold) {
        const diff = b1.top - (b2.top + b2.height);
        selectedElement.style.top = (b2.top + b2.height) + "%";
        selectedElement.style.height = (b1.height + diff) + "%";
        showGuideLine(null, rect2.bottom);
      }
    });
  };

  if (resizeSide === "left") {
    let newLeft = startLeft + dx;
    let newWidth = startWidth - dx;

    if (Math.abs(percent(newLeft, canvasRect.width)) < 1) {
      newLeft = 0;
      newWidth = startWidth + startLeft;
    }

    if (newWidth >= 20) {
      selectedElement.style.left = percent(newLeft, canvasRect.width) + "%";
      selectedElement.style.width = percent(newWidth, canvasRect.width) + "%";
      clearGuides();
      applyScalingSnapGuides();
      updateCanvaSelectionBox(selectedElement);
    }
  }

  if (resizeSide === "right") {
    let newWidth = startWidth + dx;

    let rightEdge = startLeft + newWidth;
    if (Math.abs(percent(rightEdge, canvasRect.width) - 100) < 1) {
      newWidth = canvasRect.width - startLeft;
    }

    if (newWidth >= 20) {
      selectedElement.style.width = percent(newWidth, canvasRect.width) + "%";
      applyScalingSnapGuides();
      updateCanvaSelectionBox(selectedElement);
    }
  }

  if (resizeSide === "top") {
    let newHeight = startHeight - dy;
    let newTop = startTop + dy;

    if (Math.abs(percent(newTop, canvasRect.height)) < 1) {
      newTop = 0;
      newHeight = startTop + startHeight;
    }

    if (newHeight >= 20) {
      selectedElement.style.top = percent(newTop, canvasRect.height) + "%";
      selectedElement.style.height = percent(newHeight, canvasRect.height) + "%";
      clearGuides();
      applyScalingSnapGuides();
      updateCanvaSelectionBox(selectedElement);
    }
  }

  if (resizeSide === "bottom") {
    let newHeight = startHeight + dy;
    let snapped = false;

    const currentTop = parseFloat(selectedElement.style.top || "0");
    const newBottom = currentTop + percent(newHeight, canvasRect.height);

    if (Math.abs(newBottom - 100) < 1) {
      newHeight = (100 - currentTop) * canvasRect.height / 100;
      snapped = true;
    }

    if (newHeight >= 20) {
      selectedElement.style.height = percent(newHeight, canvasRect.height) + "%";
      applyScalingSnapGuides();
      updateCanvaSelectionBox(selectedElement);
      if (snapped) showGuideLine(null, canvasRect.bottom);
    }
  }
});

document.getElementById('page-buttons').addEventListener('wheel', function (e) {
  if (e.deltaY !== 0) {
    e.preventDefault();
    this.scrollLeft += e.deltaY;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Control") {
    isCtrlPressed = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Control") {
    isCtrlPressed = false;
  }
});


// Zoom and Pan Event Listeners
const canvasWrapper = document.getElementById('canvas-wrapper');

// Professional wheel zoom handling
canvasWrapper.addEventListener('wheel', function(e) {
  e.preventDefault();
  e.stopPropagation();
  
  // Get mouse position relative to the canvas
  const rect = canvasWrapper.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  
  // Calculate zoom delta with improved sensitivity
  const delta = -e.deltaY * ZOOM_CONFIG.sensitivity;
  const zoomFactor = Math.exp(delta);
  const newZoom = canvasZoom * zoomFactor;
  
  zoomToPoint(mouseX, mouseY, newZoom, false);
});

// Mouse panning setup
canvasWrapper.addEventListener('mousedown', function(e) {
  if (e.button === 1) { // Middle mouse button
    e.preventDefault();
    e.stopPropagation();
    isPanningWithMiddle = true;
    lastPanX = e.clientX;
    lastPanY = e.clientY;
    document.body.style.cursor = 'grabbing';
  }
});

document.getElementById('actual-canvas').addEventListener('mousedown', function(e) {
  if (e.button === 2) { // Right mouse button
    e.preventDefault();
    e.stopPropagation();
    isPanningWithRight = true;
    isPanning = true;
    lastPanX = e.clientX;
    lastPanY = e.clientY;
    document.body.style.cursor = 'grabbing';
  }
});

document.getElementById('actual-canvas').addEventListener('contextmenu', function(e) {
  if (isPanningWithRight || isPanning) {
    e.preventDefault();
    e.stopPropagation();
  }
});

document.addEventListener('mouseup', function(e) {
  if ((e.button === 2 && isPanningWithRight) || (e.button === 1 && isPanningWithMiddle)) {
    isPanningWithRight = false;
    isPanningWithMiddle = false;
    isPanning = false;
    document.body.style.cursor = '';
  }
});

document.addEventListener('mousemove', function(e) {
  if (isPanningWithMiddle || isPanningWithRight) {
    e.preventDefault();
    e.stopPropagation();
    
    const deltaX = e.clientX - lastPanX;
    const deltaY = e.clientY - lastPanY;
    
    canvasPanX += deltaX;
    canvasPanY += deltaY;
    
    lastPanX = e.clientX;
    lastPanY = e.clientY;
    
    updateCanvasTransform(false);
    
    isPanning = true;
  }
});

// Enhanced keyboard zoom controls
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === '=' || e.key === '+') {
      e.preventDefault();
      const rect = canvasWrapper.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const newZoom = canvasZoom + ZOOM_CONFIG.keyboardStep;
      zoomToPoint(centerX, centerY, newZoom);
      
    } else if (e.key === '-') {
      e.preventDefault();
      const rect = canvasWrapper.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const newZoom = canvasZoom - ZOOM_CONFIG.keyboardStep;
      zoomToPoint(centerX, centerY, newZoom);
      
    } else if (e.key === '0') {
      e.preventDefault();
      resetCanvasView();
    } else if (e.key === '9') {
      e.preventDefault();
      zoomToFit();
    }
  }
});

// Double-click to reset view
canvasWrapper.addEventListener('dblclick', function(e) {
  if (e.target === canvasWrapper || e.target === document.getElementById('actual-canvas')) {
    resetCanvasView();
  }
});

// Handle window resize
window.addEventListener('resize', function() {
  updateCanvasTransform(false);
  // Update selection box position if element is selected
  if (selectedElement) {
    updateCanvaSelectionBox(selectedElement);
  }
});

// Initialize canvas transform
document.addEventListener('DOMContentLoaded', function() {
  updateCanvasTransform();
});