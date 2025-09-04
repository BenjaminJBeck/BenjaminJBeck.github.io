// CanvasFunctions.js - Canvas element selection and manipulation system

class CanvasElementManager {
    constructor() {
        this.canvas = document.getElementById('actual-canvas');
        this.selectedElement = null;
        this.selectionBox = null;
        this.isDragging = false;
        this.isResizing = false;
        this.isRotating = false;
        this.dragStartPos = { x: 0, y: 0 };
        this.elementStartPos = { x: 0, y: 0 };
        this.resizeHandle = null;
        this.rotationCenter = { x: 0, y: 0 };
        this.startAngle = 0;
        
        this.init();
    }
    
    init() {
        if (!this.canvas) {
            console.error('Canvas element with ID "actual-canvas" not found');
            return;
        }
        
        this.setupEventListeners();
        this.createSelectionBox();
    }
    
    setupEventListeners() {
        // Don't override existing click handlers, instead use a different approach
        // We'll listen for clicks on the canvas but check if the event was already handled
        this.canvas.addEventListener('click', (e) => {
            // Only handle if the click wasn't already processed by existing handlers
            setTimeout(() => this.handleCanvasClick(e), 0);
        }, true); // Use capture phase
        
        // Global mouse events
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Deselect when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.canvas.contains(e.target) && !this.isElementInSelectionSystem(e.target)) {
                this.deselectElement();
            }
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }
    
    createSelectionBox() {
        this.selectionBox = document.createElement('div');
        this.selectionBox.className = 'canvas-selection-box';
        this.selectionBox.style.cssText = `
            position: absolute;
            border: 2px solid #4285f4;
            background: transparent;
            pointer-events: none;
            display: none;
            z-index: 1000;
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.8);
        `;
        
        // Create resize handles
        this.createResizeHandles();
        
        // Create rotation handle
        this.createRotationHandle();
        
        document.body.appendChild(this.selectionBox);
    }
    
    createResizeHandles() {
        const handles = [
            'nw', 'n', 'ne',
            'w',       'e',
            'sw', 's', 'se'
        ];
        
        handles.forEach(position => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${position}`;
            handle.dataset.position = position;
            
            const isCorner = ['nw', 'ne', 'sw', 'se'].includes(position);
            const size = isCorner ? '8px' : '6px';
            
            handle.style.cssText = `
                position: absolute;
                width: ${size};
                height: ${size};
                background: #4285f4;
                border: 1px solid white;
                border-radius: ${isCorner ? '2px' : '1px'};
                cursor: ${this.getCursorForHandle(position)};
                pointer-events: auto;
                z-index: 1001;
            `;
            
            this.positionHandle(handle, position);
            
            handle.addEventListener('mousedown', (e) => this.startResize(e, position));
            
            this.selectionBox.appendChild(handle);
        });
    }
    
    createRotationHandle() {
        const rotateHandle = document.createElement('div');
        rotateHandle.className = 'rotate-handle';
        rotateHandle.style.cssText = `
            position: absolute;
            width: 12px;
            height: 12px;
            background: #4285f4;
            border: 2px solid white;
            border-radius: 50%;
            cursor: grab;
            pointer-events: auto;
            z-index: 1001;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        `;
        
        // Add rotation line
        const rotationLine = document.createElement('div');
        rotationLine.style.cssText = `
            position: absolute;
            width: 1px;
            height: 15px;
            background: #4285f4;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            pointer-events: none;
        `;
        
        rotateHandle.appendChild(rotationLine);
        rotateHandle.addEventListener('mousedown', (e) => this.startRotation(e));
        
        this.selectionBox.appendChild(rotateHandle);
    }
    
    positionHandle(handle, position) {
        const positions = {
            'nw': { top: '-4px', left: '-4px' },
            'n': { top: '-3px', left: '50%', transform: 'translateX(-50%)' },
            'ne': { top: '-4px', right: '-4px' },
            'w': { top: '50%', left: '-3px', transform: 'translateY(-50%)' },
            'e': { top: '50%', right: '-3px', transform: 'translateY(-50%)' },
            'sw': { bottom: '-4px', left: '-4px' },
            's': { bottom: '-3px', left: '50%', transform: 'translateX(-50%)' },
            'se': { bottom: '-4px', right: '-4px' }
        };
        
        const pos = positions[position];
        Object.assign(handle.style, pos);
    }
    
    getCursorForHandle(position) {
        const cursors = {
            'nw': 'nw-resize',
            'n': 'n-resize',
            'ne': 'ne-resize',
            'w': 'w-resize',
            'e': 'e-resize',
            'sw': 'sw-resize',
            's': 's-resize',
            'se': 'se-resize'
        };
        return cursors[position];
    }
    
    handleCanvasClick(e) {
        e.stopPropagation();
        
        // Find the clicked element (excluding the canvas itself)
        const clickedElement = this.findClickableElement(e.target);
        
        if (clickedElement && clickedElement !== this.canvas) {
            this.selectElement(clickedElement);
        } else {
            this.deselectElement();
        }
    }
    
    findClickableElement(target) {
        // Look for elements that can be selected (images, divs with content, etc.)
        let element = target;
        
        while (element && element !== this.canvas) {
            // Check if this is a selectable element
            if (this.isSelectableElement(element)) {
                return element;
            }
            element = element.parentElement;
        }
        
        return null;
    }
    
    isSelectableElement(element) {
        // Define what elements can be selected
        const selectableTags = ['IMG', 'DIV', 'SPAN', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BUTTON', 'VIDEO', 'AUDIO', 'CANVAS', 'SVG'];
        const isSelectableTag = selectableTags.includes(element.tagName);
        const isCanvasChild = this.canvas.contains(element) && element !== this.canvas;
        
        // Check if element has the 'selectable' class (from your existing system)
        const hasSelectableClass = element.classList.contains('selectable');
        
        // For images, videos, and other media elements, we don't need text content
        const isMediaElement = ['IMG', 'VIDEO', 'AUDIO', 'CANVAS', 'SVG'].includes(element.tagName);
        const hasContent = isMediaElement || element.textContent.trim() !== '' || element.children.length > 0;
        
        // Debug logging
        if (isSelectableTag && isCanvasChild) {
            console.log('Checking element for selection:', {
                tag: element.tagName,
                hasContent: hasContent,
                isMediaElement: isMediaElement,
                hasSelectableClass: hasSelectableClass,
                classes: Array.from(element.classList),
                element: element
            });
        }
        
        // Element is selectable if it's a valid tag, in the canvas, and either has the selectable class or has content
        return isSelectableTag && isCanvasChild && (hasSelectableClass || hasContent);
    }
    
    selectElement(element) {
        this.deselectElement(); // Clear previous selection
        
        this.selectedElement = element;
        this.selectedElement.classList.add('canvas-selected');
        
        // Also integrate with your existing system
        if (typeof selectedElement !== 'undefined') {
            // Clear existing selected elements from your system
            document.querySelectorAll('.selectable.selected').forEach(el => el.classList.remove('selected'));
            // Set this element as selected in your system too
            element.classList.add('selected');
            selectedElement = element;
        }
        
        // Add selection styling to the element
        this.addSelectionStyling(element);
        
        // Position and show selection box
        this.updateSelectionBox();
        this.selectionBox.style.display = 'block';
        
        // Make element draggable (but don't override existing mousedown handlers)
        if (!element.hasCanvasManagerListener) {
            element.addEventListener('mousedown', (e) => {
                // Only handle if this wasn't already handled by existing logic
                if (e.detail !== 'canvasManager') {
                    this.startDrag(e);
                }
            });
            element.hasCanvasManagerListener = true;
        }
    }
    
    addSelectionStyling(element) {
        // Add a subtle selection style to the element itself
        if (!element.dataset.originalBoxShadow) {
            element.dataset.originalBoxShadow = element.style.boxShadow || 'none';
        }
        element.style.boxShadow = '0 0 0 1px rgba(66, 133, 244, 0.3)';
    }
    
    deselectElement() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('canvas-selected');
            
            // Restore original styling
            if (this.selectedElement.dataset.originalBoxShadow) {
                this.selectedElement.style.boxShadow = this.selectedElement.dataset.originalBoxShadow;
                delete this.selectedElement.dataset.originalBoxShadow;
            }
            
            this.selectedElement = null;
        }
        
        this.selectionBox.style.display = 'none';
    }
    
    updateSelectionBox() {
        if (!this.selectedElement) return;
        
        const rect = this.selectedElement.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();
        
        // Position relative to the canvas
        const left = rect.left - canvasRect.left;
        const top = rect.top - canvasRect.top;
        
        this.selectionBox.style.left = `${canvasRect.left + left}px`;
        this.selectionBox.style.top = `${canvasRect.top + top}px`;
        this.selectionBox.style.width = `${rect.width}px`;
        this.selectionBox.style.height = `${rect.height}px`;
    }
    
    startDrag(e) {
        if (!this.selectedElement || this.isResizing || this.isRotating) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        this.isDragging = true;
        this.dragStartPos = { x: e.clientX, y: e.clientY };
        
        const rect = this.selectedElement.getBoundingClientRect();
        this.elementStartPos = { x: rect.left, y: rect.top };
        
        this.selectedElement.style.cursor = 'grabbing';
    }
    
    startResize(e, position) {
        e.preventDefault();
        e.stopPropagation();
        
        this.isResizing = true;
        this.resizeHandle = position;
        this.dragStartPos = { x: e.clientX, y: e.clientY };
        
        const rect = this.selectedElement.getBoundingClientRect();
        this.elementStartPos = {
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
        };
        
        document.body.style.cursor = this.getCursorForHandle(position);
    }
    
    startRotation(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.isRotating = true;
        
        const rect = this.selectedElement.getBoundingClientRect();
        this.rotationCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
        
        this.startAngle = Math.atan2(
            e.clientY - this.rotationCenter.y,
            e.clientX - this.rotationCenter.x
        );
        
        document.body.style.cursor = 'grabbing';
    }
    
    handleMouseMove(e) {
        if (this.isDragging) {
            this.handleDrag(e);
        } else if (this.isResizing) {
            this.handleResize(e);
        } else if (this.isRotating) {
            this.handleRotation(e);
        }
        
        // Update selection box position if element is selected
        if (this.selectedElement && !this.isDragging && !this.isResizing && !this.isRotating) {
            this.updateSelectionBox();
        }
    }
    
    handleDrag(e) {
        if (!this.selectedElement) return;
        
        const deltaX = e.clientX - this.dragStartPos.x;
        const deltaY = e.clientY - this.dragStartPos.y;
        
        this.selectedElement.style.position = 'absolute';
        this.selectedElement.style.left = `${this.elementStartPos.x - this.canvas.getBoundingClientRect().left + deltaX}px`;
        this.selectedElement.style.top = `${this.elementStartPos.y - this.canvas.getBoundingClientRect().top + deltaY}px`;
        
        this.updateSelectionBox();
    }
    
    handleResize(e) {
        if (!this.selectedElement || !this.resizeHandle) return;
        
        const deltaX = e.clientX - this.dragStartPos.x;
        const deltaY = e.clientY - this.dragStartPos.y;
        
        const newBounds = this.calculateNewBounds(this.resizeHandle, deltaX, deltaY);
        
        this.selectedElement.style.position = 'absolute';
        this.selectedElement.style.left = `${newBounds.x}px`;
        this.selectedElement.style.top = `${newBounds.y}px`;
        this.selectedElement.style.width = `${newBounds.width}px`;
        this.selectedElement.style.height = `${newBounds.height}px`;
        
        this.updateSelectionBox();
    }
    
    calculateNewBounds(handle, deltaX, deltaY) {
        const canvasRect = this.canvas.getBoundingClientRect();
        const bounds = {
            x: this.elementStartPos.x - canvasRect.left,
            y: this.elementStartPos.y - canvasRect.top,
            width: this.elementStartPos.width,
            height: this.elementStartPos.height
        };
        
        switch (handle) {
            case 'nw':
                bounds.width -= deltaX;
                bounds.height -= deltaY;
                bounds.x += deltaX;
                bounds.y += deltaY;
                break;
            case 'n':
                bounds.height -= deltaY;
                bounds.y += deltaY;
                break;
            case 'ne':
                bounds.width += deltaX;
                bounds.height -= deltaY;
                bounds.y += deltaY;
                break;
            case 'w':
                bounds.width -= deltaX;
                bounds.x += deltaX;
                break;
            case 'e':
                bounds.width += deltaX;
                break;
            case 'sw':
                bounds.width -= deltaX;
                bounds.height += deltaY;
                bounds.x += deltaX;
                break;
            case 's':
                bounds.height += deltaY;
                break;
            case 'se':
                bounds.width += deltaX;
                bounds.height += deltaY;
                break;
        }
        
        // Ensure minimum size
        bounds.width = Math.max(20, bounds.width);
        bounds.height = Math.max(20, bounds.height);
        
        return bounds;
    }
    
    handleRotation(e) {
        if (!this.selectedElement) return;
        
        const currentAngle = Math.atan2(
            e.clientY - this.rotationCenter.y,
            e.clientX - this.rotationCenter.x
        );
        
        const rotation = (currentAngle - this.startAngle) * (180 / Math.PI);
        
        // Get current rotation or default to 0
        const currentTransform = this.selectedElement.style.transform || '';
        const rotateMatch = currentTransform.match(/rotate\([^)]*\)/);
        const otherTransforms = currentTransform.replace(/rotate\([^)]*\)\s*/, '');
        
        this.selectedElement.style.transform = `${otherTransforms} rotate(${rotation}deg)`.trim();
        
        this.updateSelectionBox();
    }
    
    handleMouseUp(e) {
        if (this.isDragging) {
            this.selectedElement.style.cursor = 'grab';
            this.isDragging = false;
        }
        
        if (this.isResizing) {
            this.isResizing = false;
            this.resizeHandle = null;
            document.body.style.cursor = 'default';
        }
        
        if (this.isRotating) {
            this.isRotating = false;
            document.body.style.cursor = 'default';
        }
    }
    
    handleKeyDown(e) {
        if (!this.selectedElement) return;
        
        if (e.key === 'Delete' || e.key === 'Backspace') {
            this.deleteSelectedElement();
        } else if (e.key === 'Escape') {
            this.deselectElement();
        }
    }
    
    deleteSelectedElement() {
        if (this.selectedElement) {
            const element = this.selectedElement;
            this.deselectElement();
            element.remove();
        }
    }
    
    isElementInSelectionSystem(element) {
        return element === this.selectionBox || 
               this.selectionBox.contains(element) ||
               element.classList.contains('canvas-selected');
    }
    
    // Public methods for external use
    getSelectedElement() {
        return this.selectedElement;
    }
    
    selectElementById(id) {
        const element = document.getElementById(id);
        if (element) {
            this.selectElement(element);
        }
    }
    
    selectElementBySelector(selector) {
        const element = this.canvas.querySelector(selector);
        if (element) {
            this.selectElement(element);
        }
    }
    
    // Method to add elements to canvas programmatically
    addElementToCanvas(element) {
        this.canvas.appendChild(element);
        return element;
    }
    
    // Method to create a new text element
    createTextElement(text, x = 50, y = 50) {
        const textElement = document.createElement('div');
        textElement.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            padding: 10px;
            font-size: 16px;
            font-family: Arial, sans-serif;
            color: #333;
            cursor: grab;
            user-select: none;
            min-width: 50px;
            min-height: 20px;
        `;
        textElement.textContent = text;
        
        return this.addElementToCanvas(textElement);
    }
    
    // Method to create a new image element
    createImageElement(src, x = 50, y = 50) {
        const imgElement = document.createElement('img');
        imgElement.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            max-width: 200px;
            cursor: grab;
            user-select: none;
        `;
        imgElement.src = src;
        imgElement.draggable = false;
        
        return this.addElementToCanvas(imgElement);
    }
}

// Initialize the canvas element manager
let canvasManager;

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        canvasManager = new CanvasElementManager();
    });
} else {
    canvasManager = new CanvasElementManager();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CanvasElementManager;
}

// Add to global scope for easy access
window.CanvasElementManager = CanvasElementManager;