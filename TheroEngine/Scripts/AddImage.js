(() => {
    const wrapper = document.getElementById('canvas-wrapper');
    const scene = document.getElementById('actual-canvas');
    const fileInput = document.getElementById('imageInput');

    // If Fabric.js is loaded later (via <script>), weâ€™ll use it automatically.
    let fabricCanvas = null;
    const hasFabric = () => !!window.fabric;

    function ensureFabric() {
        if (!hasFabric()) return null;
        if (fabricCanvas) return fabricCanvas;

        const htmlCanvas = document.getElementById('fabric-canvas');

        fabricCanvas = new fabric.Canvas(htmlCanvas, {
            preserveObjectStacking: true,
            selection: true,
            selectionBorderColor: 'rgba(255,255,255,0.8)',
            selectionColor: 'rgba(102,126,234,0.15)',
            selectionLineWidth: 1
        });

        // CRITICAL: Tell Fabric to include custom properties when serializing
        fabric.Image.prototype.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    customImagePath: this.customImagePath,
                    customImageName: this.customImageName,
                    elementID: this.elementID  // NEW: Include ElementID in serialization
                });
            };
        })(fabric.Image.prototype.toObject);

        // Make controls visible and comfy
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.borderScaleFactor = 2;
        fabric.Object.prototype.cornerSize = 10;

        // Size Fabric px to content area
        function resizeFabric() {
            const rect = scene.getBoundingClientRect();
            const newWidth = rect.width;
            const newHeight = rect.height;

            const oldWidth = fabricCanvas.getWidth();
            const oldHeight = fabricCanvas.getHeight();

            if (oldWidth === 0 || oldHeight === 0) {
                fabricCanvas.setWidth(newWidth);
                fabricCanvas.setHeight(newHeight);
                fabricCanvas.requestRenderAll();
                return;
            }

            // Calculate scale factors for position and size
            const scaleX = newWidth / oldWidth;
            const scaleY = newHeight / oldHeight;

            // Scale all objects
            fabricCanvas.getObjects().forEach(obj => {
                // Scale the object size and position proportionally
                obj.scaleX *= scaleX;
                obj.scaleY *= scaleY;
                obj.left *= scaleX;
                obj.top *= scaleY;
                obj.setCoords();
            });

            // Update canvas dimensions
            fabricCanvas.setWidth(newWidth);
            fabricCanvas.setHeight(newHeight);
            fabricCanvas.requestRenderAll();
        }
        resizeFabric();
        window.addEventListener('resize', resizeFabric);

        // Update element name box when selection changes
        fabricCanvas.on('selection:created', (e) => {
            updateElementNameBox(e.selected?.[0]);
        });
        fabricCanvas.on('selection:updated', (e) => {
            updateElementNameBox(e.selected?.[0]);
        });
        fabricCanvas.on('selection:cleared', () => {
            updateElementNameBox(null);
        });

        function updateElementNameBox(obj) {
            const nameBox = document.getElementById('element-name-box');
            const propsContainer = document.getElementById('properties-container');
            if (!nameBox) return;

            if (obj && obj.elementID) {
                nameBox.textContent = obj.elementID;
                updatePropertiesPanel(obj);
            } else if (obj) {
                nameBox.textContent = `${obj.type || 'Element'} (No ID)`;
                updatePropertiesPanel(obj);
            } else {
                nameBox.textContent = 'No Element Selected';
                if (propsContainer) propsContainer.innerHTML = '';
            }
        }

        function updatePropertiesPanel(obj) {
            const container = document.getElementById('properties-container');
            if (!container || !obj) return;

            const fc = window.getFabric?.();
            if (!fc) return;

            container.innerHTML = `
                <!-- Properties Label -->
                <div id="properties-label">
                    <span>Properties</span>
                    <span class="properties-arrow">▾</span>
                </div>
                
                <div class="properties-content">
                <!-- Position -->
                <div class="property-row">
                    <div class="property-label">Position (X, Y)</div>
                    <div class="property-dual">
                        <input type="number" class="property-input" id="prop-x" value="${Math.round(obj.left || 0)}" step="1">
                        <input type="number" class="property-input" id="prop-y" value="${Math.round(obj.top || 0)}" step="1">
                    </div>
                </div>
                
                <!-- Proportional Scale -->
<div class="property-row">
    <div class="property-label">Scale (Proportional)</div>
    <input type="number" class="property-input" id="prop-scale" value="${(obj.scaleX || 1).toFixed(2)}" step="0.1" min="0.1">
</div>

<!-- Scale -->
<div class="property-row">
    <div class="property-label">Scale (X, Y)</div>
    <div class="property-dual">
        <input type="number" class="property-input" id="prop-scale-x" value="${(obj.scaleX || 1).toFixed(2)}" step="0.1" min="0.1">
        <input type="number" class="property-input" id="prop-scale-y" value="${(obj.scaleY || 1).toFixed(2)}" step="0.1" min="0.1">
    </div>
</div>
                
                <!-- Rotation -->
                <div class="property-row">
                    <div class="property-label">Rotation (degrees)</div>
                    <input type="number" class="property-input" id="prop-rotation" value="${Math.round(obj.angle || 0)}" step="1" min="0" max="360">
                </div>
                
                <!-- Opacity -->
                <div class="property-row">
                    <div class="property-label">Opacity (0-100%)</div>
                    <input type="number" class="property-input" id="prop-opacity" value="${Math.round((obj.opacity || 1) * 100)}" step="1" min="0" max="100">
                </div>
                
                <!-- Shadow -->
                <div class="property-row">
                    <div class="property-label">Shadow</div>
                    <div class="property-dual">
                        <input type="number" class="property-input" id="prop-shadow-blur" placeholder="Blur" value="${obj.shadow?.blur || 0}" step="1" min="0">
                        <input type="color" class="property-input" id="prop-shadow-color" value="${obj.shadow?.color || '#000000'}" style="padding:2px;">
                    </div>
                </div>
                
                <!-- Filters -->
                <div class="property-row">
                    <div class="property-label">Brightness (-100 to 100)</div>
                    <input type="number" class="property-input" id="prop-brightness" value="0" step="5" min="-100" max="100">
                </div>
                
                <div class="property-row">
                    <div class="property-label">Saturation (-100 to 100)</div>
                    <input type="number" class="property-input" id="prop-saturation" value="0" step="5" min="-100" max="100">
                </div>
                
                <div class="property-row">
                    <div class="property-label">Blur (0-20px)</div>
                    <input type="number" class="property-input" id="prop-blur" value="0" step="1" min="0" max="20">
                </div>
                
                <!-- Tint Color for Images -->
                ${obj.type === 'image' ? `
                <div class="property-row">
                    <div class="property-label">Tint Color</div>
                    <div class="property-dual">
                        <input type="color" class="property-input" id="prop-tint-color" value="#ffffff" style="padding:2px;">
                        <input type="number" class="property-input" id="prop-tint-opacity" placeholder="Intensity" value="0" step="10" min="0" max="100">
                    </div>
                </div>
                ` : ''}
                
                <!-- Layering Controls -->
                <div class="property-row">
                    <div class="property-label">Layer Order</div>
                    <div class="property-dual">
                        <button class="property-input" id="prop-bring-forward" style="cursor:pointer;">Bring Forward</button>
                        <button class="property-input" id="prop-send-backward" style="cursor:pointer;">Send Backward</button>
                    </div>
                </div>
                <div class="property-row">
                    <div class="property-dual">
                        <button class="property-input" id="prop-bring-to-front" style="cursor:pointer;">Bring to Front</button>
                        <button class="property-input" id="prop-send-to-back" style="cursor:pointer;">Send to Back</button>
                        </div>
                </div>
                </div>

                <!-- Event Listeners Section -->
                <div id="event-listeners-container">
                    <div id="event-listeners-label">
                        <span>Event Listeners</span>
                        <span class="event-listeners-arrow">▾</span>
                    </div>

                    <div class="event-listeners-content">
                        <div class="property-row">
                            <div class="property-label">On Click</div>
                            <input type="text" class="property-input" id="event-onclick" placeholder="Function name">
                        </div>

                        <div class="property-row">
                            <div class="property-label">On Hover</div>
                            <input type="text" class="property-input" id="event-onhover" placeholder="Function name">
                        </div>

                        <div class="property-row">
                            <div class="property-label">On Load</div>
                            <input type="text" class="property-input" id="event-onload" placeholder="Function name">
                        </div>
                    </div>
                </div>
            `;

            // Add event listeners for real-time updates
            setupPropertyListeners(obj, fc);

            // Setup collapsible functionality for Properties
            const propsLabel = document.getElementById('properties-label');
            const propsContent = container.querySelector('.properties-content');
            if (propsLabel && propsContent) {
                propsLabel.addEventListener('click', () => {
                    container.classList.toggle('collapsed');
                });
            }

            // Setup collapsible functionality for Event Listeners
            const eventLabel = document.getElementById('event-listeners-label');
            const eventContainer = document.getElementById('event-listeners-container');
            const eventContent = container.querySelector('.event-listeners-content');
            if (eventLabel && eventContent) {
                eventLabel.addEventListener('click', () => {
                    eventContainer.classList.toggle('collapsed');
                });
            }
        }

        function setupPropertyListeners(obj, fc) {
            // Helper to trigger history save after property changes
            const triggerModified = () => {
                fc.fire('object:modified', { target: obj });
            };

            // Position
            const propX = document.getElementById('prop-x');
            const propY = document.getElementById('prop-y');
            if (propX) {
                propX.addEventListener('input', (e) => {
                    obj.set('left', parseFloat(e.target.value));
                    fc.requestRenderAll();
                });
                propX.addEventListener('change', triggerModified);
            }
            if (propY) {
                propY.addEventListener('input', (e) => {
                    obj.set('top', parseFloat(e.target.value));
                    fc.requestRenderAll();
                });
                propY.addEventListener('change', triggerModified);
            }

            // Proportional Scale
            const propScale = document.getElementById('prop-scale');
            if (propScale) {
                propScale.addEventListener('input', (e) => {
                    const scale = parseFloat(e.target.value);
                    obj.set('scaleX', scale);
                    obj.set('scaleY', scale);
                    // Update the individual X/Y inputs to match
                    const propScaleX = document.getElementById('prop-scale-x');
                    const propScaleY = document.getElementById('prop-scale-y');
                    if (propScaleX) propScaleX.value = scale.toFixed(2);
                    if (propScaleY) propScaleY.value = scale.toFixed(2);
                    fc.requestRenderAll();
                });
                propScale.addEventListener('change', triggerModified);
            }

            // Scale X and Y (independent)
            const propScaleX = document.getElementById('prop-scale-x');
            const propScaleY = document.getElementById('prop-scale-y');
            if (propScaleX) {
                propScaleX.addEventListener('input', (e) => {
                    obj.set('scaleX', parseFloat(e.target.value));
                    fc.requestRenderAll();
                });
                propScaleX.addEventListener('change', triggerModified);
            }
            if (propScaleY) {
                propScaleY.addEventListener('input', (e) => {
                    obj.set('scaleY', parseFloat(e.target.value));
                    fc.requestRenderAll();
                });
                propScaleY.addEventListener('change', triggerModified);
            }

            // Rotation
            const propRotation = document.getElementById('prop-rotation');
            if (propRotation) {
                propRotation.addEventListener('input', (e) => {
                    obj.set('angle', parseFloat(e.target.value));
                    fc.requestRenderAll();
                });
                propRotation.addEventListener('change', triggerModified);
            }

            // Opacity
            const propOpacity = document.getElementById('prop-opacity');
            if (propOpacity) {
                propOpacity.addEventListener('input', (e) => {
                    obj.set('opacity', parseFloat(e.target.value) / 100);
                    fc.requestRenderAll();
                });
                propOpacity.addEventListener('change', triggerModified);
            }

            // Shadow
            const propShadowBlur = document.getElementById('prop-shadow-blur');
            const propShadowColor = document.getElementById('prop-shadow-color');
            if (propShadowBlur || propShadowColor) {
                const updateShadow = () => {
                    const blur = propShadowBlur ? parseFloat(propShadowBlur.value) : 0;
                    const color = propShadowColor ? propShadowColor.value : '#000000';
                    if (blur > 0) {
                        obj.set('shadow', new fabric.Shadow({
                            color: color,
                            blur: blur,
                            offsetX: 0,
                            offsetY: 0
                        }));
                    } else {
                        obj.set('shadow', null);
                    }
                    fc.requestRenderAll();
                };
                if (propShadowBlur) {
                    propShadowBlur.addEventListener('input', updateShadow);
                    propShadowBlur.addEventListener('change', triggerModified);
                }
                if (propShadowColor) {
                    propShadowColor.addEventListener('input', updateShadow);
                    propShadowColor.addEventListener('change', triggerModified);
                }
            }

            // Brightness, Saturation, Blur filters
            const propBrightness = document.getElementById('prop-brightness');
            const propSaturation = document.getElementById('prop-saturation');
            const propBlur = document.getElementById('prop-blur');

            const updateFilters = () => {
                const filters = [];
                const brightness = propBrightness ? parseFloat(propBrightness.value) / 100 : 0;
                const saturation = propSaturation ? parseFloat(propSaturation.value) / 100 : 0;
                const blur = propBlur ? parseFloat(propBlur.value) / 20 : 0;

                if (brightness !== 0) {
                    filters.push(new fabric.Image.filters.Brightness({ brightness }));
                }
                if (saturation !== 0) {
                    filters.push(new fabric.Image.filters.Saturation({ saturation }));
                }
                if (blur > 0) {
                    filters.push(new fabric.Image.filters.Blur({ blur }));
                }

                obj.filters = filters;
                obj.applyFilters();
                fc.requestRenderAll();
            };

            if (propBrightness) {
                propBrightness.addEventListener('input', updateFilters);
                propBrightness.addEventListener('change', triggerModified);
            }
            if (propSaturation) {
                propSaturation.addEventListener('input', updateFilters);
                propSaturation.addEventListener('change', triggerModified);
            }
            if (propBlur) {
                propBlur.addEventListener('input', updateFilters);
                propBlur.addEventListener('change', triggerModified);
            }

            // Tint for images
            const propTintColor = document.getElementById('prop-tint-color');
            const propTintOpacity = document.getElementById('prop-tint-opacity');
            if (propTintColor && propTintOpacity) {
                const updateTint = () => {
                    const intensity = parseFloat(propTintOpacity.value) / 100;
                    const color = propTintColor.value;

                    if (intensity > 0) {
                        const tintFilter = new fabric.Image.filters.BlendColor({
                            color: color,
                            mode: 'tint',
                            alpha: intensity
                        });

                        // Add tint to existing filters
                        const otherFilters = obj.filters?.filter(f => f.type !== 'BlendColor') || [];
                        obj.filters = [...otherFilters, tintFilter];
                        obj.applyFilters();
                    }
                    fc.requestRenderAll();
                };

                propTintColor.addEventListener('input', updateTint);
                propTintColor.addEventListener('change', triggerModified);
                propTintOpacity.addEventListener('input', updateTint);
                propTintOpacity.addEventListener('change', triggerModified);
            }

            // Layering controls
            const propBringForward = document.getElementById('prop-bring-forward');
            const propSendBackward = document.getElementById('prop-send-backward');
            const propBringToFront = document.getElementById('prop-bring-to-front');
            const propSendToBack = document.getElementById('prop-send-to-back');

            if (propBringForward) {
                propBringForward.addEventListener('click', () => {
                    fc.bringForward(obj);
                    fc.requestRenderAll();
                    triggerModified();
                });
            }
            if (propSendBackward) {
                propSendBackward.addEventListener('click', () => {
                    fc.sendBackwards(obj);
                    fc.requestRenderAll();
                    triggerModified();
                });
            }
            if (propBringToFront) {
                propBringToFront.addEventListener('click', () => {
                    fc.bringToFront(obj);
                    fc.requestRenderAll();
                    triggerModified();
                });
            }
            if (propSendToBack) {
                propSendToBack.addEventListener('click', () => {
                    fc.sendToBack(obj);
                    fc.requestRenderAll();
                    triggerModified();
                });
            }
        }

        // Keep Fabric in sync with your outer zoom/pan (uses your window.onCanvasViewChange hook)
        window.onCanvasViewChange = function (scale, tx, ty) {
            if (!fabricCanvas) return;
            // FIXED: Don't apply the outer transform to Fabric's viewport
            // Fabric should stay at identity transform
            fabricCanvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
            fabricCanvas.requestRenderAll();
        };

        // --- Shift modifiers + snapping ---
        const ROT_SNAP = 15; // degrees

        // Proportional scaling while holding Shift
        fabricCanvas.on('mouse:down', (opt) => {
            const t = opt.target;
            if (!t) return;
            t.__origUniformScaling = t.uniformScaling;
            t.uniformScaling = !!(opt.e && opt.e.shiftKey);
        });
        fabricCanvas.on('mouse:up', (opt) => {
            const t = opt.target;
            if (!t) return;
            t.uniformScaling = t.__origUniformScaling ?? false;
        });
        fabricCanvas.on('object:scaling', (opt) => {
            const t = opt.target;
            const e = opt.e;
            if (!t) return;
            t.uniformScaling = !!(e && e.shiftKey);
        });

        // Snap rotation to increments while holding Shift
        fabricCanvas.on('object:rotating', (opt) => {
            const t = opt.target;
            const e = opt.e;
            if (!t || !e || !e.shiftKey) return;
            const snapped = Math.round(t.angle / ROT_SNAP) * ROT_SNAP;
            t.rotate(snapped);
            fabricCanvas.requestRenderAll();
        });

        // --- History (Undo/Redo) ---
        const MAX_HISTORY = 50;
        const history = [];
        const redoStack = [];
        let suppressHistory = false;

        function saveHistory() {
            if (suppressHistory) return;
            // push current state
            const json = fabricCanvas.toDatalessJSON();
            history.push(json);
            if (history.length > MAX_HISTORY) history.shift();
            // new action clears redo
            redoStack.length = 0;
        }

        // Initial empty state
        saveHistory();

        // Save on meaningful changes
        fabricCanvas.on('object:added', () => saveHistory());
        fabricCanvas.on('object:removed', () => saveHistory());
        fabricCanvas.on('object:modified', () => saveHistory());

        function loadFromJSON(json) {
            suppressHistory = true;
            fabricCanvas.loadFromJSON(json, () => {
                fabricCanvas.renderAll();
                suppressHistory = false;
            });
        }

        // Expose Undo/Redo + Delete + Select All for menu & keys
        window.UndoFunction = function () {
            if (history.length <= 1) return;
            const current = history.pop();        // current
            redoStack.push(current);
            const prev = history[history.length - 1];
            loadFromJSON(prev);
        };
        window.RedoFunction = function () {
            if (!redoStack.length) return;
            const next = redoStack.pop();
            // push current before replacing
            const cur = fabricCanvas.toDatalessJSON();
            history.push(cur);
            loadFromJSON(next);
        };
        window.DeleteFunction = function () {
            const objs = fabricCanvas.getActiveObjects();
            if (!objs.length) return;
            objs.forEach(o => fabricCanvas.remove(o));
            fabricCanvas.discardActiveObject();
            fabricCanvas.requestRenderAll();
            saveHistory();
        };
        window.SelectAllFunction = function () {
            const objs = fabricCanvas.getObjects().filter(o => !o.excludeFromExport);
            if (!objs.length) return;
            const sel = new fabric.ActiveSelection(objs, { canvas: fabricCanvas });
            fabricCanvas.setActiveObject(sel);
            fabricCanvas.requestRenderAll();
        };

        // Keyboard: Delete, Ctrl/Cmd+A, Ctrl/Cmd+Z / Shift+Ctrl/Cmd+Z or Ctrl/Cmd+Y
        document.addEventListener('keydown', (e) => {
            // Check if user is typing in an input field
            const isTyping = e.target.tagName === 'INPUT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.isContentEditable;

            // Don't intercept keys when typing in text fields
            if (isTyping) return;

            const ctrl = e.ctrlKey || e.metaKey;

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                window.DeleteFunction();
            } else if (ctrl && (e.key === 'a' || e.key === 'A')) {
                e.preventDefault();
                window.SelectAllFunction();
            } else if (ctrl && (e.key === 'z' || e.key === 'Z')) {
                e.preventDefault();
                if (e.shiftKey) window.RedoFunction();
                else window.UndoFunction();
            } else if (ctrl && (e.key === 'y' || e.key === 'Y')) {
                e.preventDefault();
                window.RedoFunction();
            }
        });

        // ------------------ Snapping + Guidelines ------------------
        // Config (content-space px; unaffected by zoom)
        const SNAP_DIST = 6;
        const GUIDE_COLOR = 'rgba(255,80,80,0.9)';
        const GUIDE_WIDTH = 1;

        // Guide line pool
        const guides = { v: [], h: [] };
        function clearGuides() {
            [...guides.v, ...guides.h].forEach(l => fabricCanvas.remove(l));
            guides.v.length = 0;
            guides.h.length = 0;
            fabricCanvas.requestRenderAll();
        }
        function addVGuide(x) {
            const line = new fabric.Line([x, 0, x, fabricCanvas.getHeight()], {
                stroke: GUIDE_COLOR, strokeWidth: GUIDE_WIDTH, selectable: false,
                evented: false, excludeFromExport: true, opacity: 0.85
            });
            guides.v.push(line);
            fabricCanvas.add(line);
            line.bringToFront();
        }
        function addHGuide(y) {
            const line = new fabric.Line([0, y, fabricCanvas.getWidth(), y], {
                stroke: GUIDE_COLOR, strokeWidth: GUIDE_WIDTH, selectable: false,
                evented: false, excludeFromExport: true, opacity: 0.85
            });
            guides.h.push(line);
            fabricCanvas.add(line);
            line.bringToFront();
        }

        // Build snap points from all other objects + canvas center
        function buildSnapIndex(skipObj) {
            const xs = new Set();
            const ys = new Set();

            // Canvas edges & center
            const W = fabricCanvas.getWidth();
            const H = fabricCanvas.getHeight();
            xs.add(0); xs.add(W / 2); xs.add(W);
            ys.add(0); ys.add(H / 2); ys.add(H);

            fabricCanvas.getObjects().forEach(o => {
                if (o === skipObj || o.excludeFromExport) return;
                // Use center + scaled bounds
                const c = o.getCenterPoint();
                const w = o.getScaledWidth();
                const h = o.getScaledHeight();
                const left = c.x - w / 2;
                const right = c.x + w / 2;
                const top = c.y - h / 2;
                const bottom = c.y + h / 2;

                xs.add(left); xs.add(c.x); xs.add(right);
                ys.add(top); ys.add(c.y); ys.add(bottom);
            });

            return { xs: Array.from(xs), ys: Array.from(ys) };
        }

        // Snap helper: returns { snappedValue, guideShown } for center/edge sets
        function snapAxis(current, candidates) {
            let best = null;
            for (const v of candidates) {
                const d = Math.abs(current - v);
                if (d <= SNAP_DIST && (best === null || d < Math.abs(current - best))) {
                    best = v;
                }
            }
            return best;
        }

        let snapIndex = null;

        // Rebuild index at begin transform (mousedown on target)
        fabricCanvas.on('mouse:down', (opt) => {
            clearGuides();
            if (opt.target) {
                snapIndex = buildSnapIndex(opt.target);
            } else {
                snapIndex = buildSnapIndex(null);
            }
        });

        // Clear when done
        fabricCanvas.on('mouse:up', () => {
            snapIndex = null;
            clearGuides();
        });
        

        // Apply snapping while moving/scaling
        function applySnapping(target, e) {
            if (!target || !snapIndex) return;

            clearGuides();

            // Work in center coordinates
            const c = target.getCenterPoint();
            const w = target.getScaledWidth();
            const h = target.getScaledHeight();

            // Candidate â€œfeaturesâ€ of the moving object
            const objXs = [
                { kind: 'left', val: c.x - w / 2 },
                { kind: 'center', val: c.x },
                { kind: 'right', val: c.x + w / 2 },
            ];
            const objYs = [
                { kind: 'top', val: c.y - h / 2 },
                { kind: 'center', val: c.y },
                { kind: 'bottom', val: c.y + h / 2 },
            ];

            // Find the single best snap per axis
            let bestX = null, bestY = null;
            for (const ox of objXs) {
                const snapped = snapAxis(ox.val, snapIndex.xs);
                if (snapped != null) {
                    const d = Math.abs(ox.val - snapped);
                    if (!bestX || d < bestX.dist) bestX = { kind: ox.kind, snapped, dist: d };
                }
            }
            for (const oy of objYs) {
                const snapped = snapAxis(oy.val, snapIndex.ys);
                if (snapped != null) {
                    const d = Math.abs(oy.val - snapped);
                    if (!bestY || d < bestY.dist) bestY = { kind: oy.kind, snapped, dist: d };
                }
            }

            let targetCx = c.x;
            let targetCy = c.y;

            if (bestX) {
                // Convert snapped edge to target center X
                if (bestX.kind === 'left') targetCx = bestX.snapped + w / 2;
                if (bestX.kind === 'center') targetCx = bestX.snapped;
                if (bestX.kind === 'right') targetCx = bestX.snapped - w / 2;
                addVGuide(bestX.kind === 'center' ? bestX.snapped : bestX.snapped);
            }
            if (bestY) {
                if (bestY.kind === 'top') targetCy = bestY.snapped + h / 2;
                if (bestY.kind === 'center') targetCy = bestY.snapped;
                if (bestY.kind === 'bottom') targetCy = bestY.snapped - h / 2;
                addHGuide(bestY.kind === 'center' ? bestY.snapped : bestY.snapped);
            }

            if (bestX || bestY) {
                target.setPositionByOrigin(new fabric.Point(targetCx, targetCy), 'center', 'center');
                fabricCanvas.requestRenderAll();
            }
        }

        // Snap when moving or scaling (rotation is visual; we donâ€™t snap angle here)
        fabricCanvas.on('object:moving', (opt) => applySnapping(opt.target, opt.e));
        fabricCanvas.on('object:scaling', (opt) => applySnapping(opt.target, opt.e));

        // Keep guide lengths correct if the canvas is resized
        window.addEventListener('resize', () => {
            if (![...guides.v, ...guides.h].length) return;
            const H2 = fabricCanvas.getHeight();
            const W2 = fabricCanvas.getWidth();
            guides.v.forEach(l => { l.set({ y1: 0, y2: H2 }); });
            guides.h.forEach(l => { l.set({ x1: 0, x2: W2 }); });
            fabricCanvas.requestRenderAll();
        });

        // Expose getter so other modules can talk to Fabric
        window.getFabric = () => fabricCanvas;
        return fabricCanvas;
    }



    window.addImage = function addImage() {
        fileInput.click();
    };

    // Initialize Fabric as soon as the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM loaded, initializing Fabric...');
            ensureFabric();
            console.log('Fabric initialized:', !!window.getFabric());
        });
    } else {
        console.log('DOM already loaded, initializing Fabric immediately...');
        ensureFabric();
        console.log('Fabric initialized:', !!window.getFabric());
    }

    fileInput.addEventListener('change', async (e) => {
        const picked = Array.from(e.target.files || []);

        // If user canceled the picker: drop in a dev placeholder so testing still works
        if (!picked.length) {
            const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
              <defs>
                <pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#eee"/>
                  <path d="M0 0 L20 20 M20 0 L0 20" stroke="#ddd" stroke-width="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#p)"/>
              <rect x="10" y="10" width="620" height="340" fill="white" stroke="#bbb"/>
              <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                    font-family="system-ui, -apple-system, Segoe UI, Roboto" font-size="22" fill="#666">
                Dev Placeholder
              </text>
            </svg>`;
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const fakeFile = new File([blob], 'DevPlaceholder.svg', { type: 'image/svg+xml' });
            await placeImageFile(fakeFile); // uses your existing DOM/Fabric loader
            fileInput.value = '';
            return;
        }

        // Which .Thero file (project) are we editing?
        const fileName = window.currentFile?.name;

        for (const f of picked) {
            if (!f.type.startsWith('image/')) continue;

            console.log('Processing file:', f.name);
            console.log('electronAPI available:', !!window.electronAPI?.addImage);
            console.log('fileName (currentFile):', fileName);

            // If we're in Electron *and* a project is open, use your existing media pipeline…
            if (window.electronAPI?.addImage && fileName) {
                console.log('Using Electron media pipeline for:', f.name);
                const srcPath = f.path; // Electron real path
                console.log('srcPath:', srcPath);

                const res = await window.electronAPI.addImage({ fileName, imagePath: srcPath });
                console.log('addImage response:', res);

                if (!res || !res.success) {
                    console.error('Failed to add image:', res?.error);
                    continue;
                }

                const relPath = res.relativePath;
                console.log('relPath received:', relPath);
                console.log('Calling placeImageFromProjectMedia with:', { fileName, relPath, displayName: f.name });

                await placeImageFromProjectMedia(fileName, relPath, f.name);
                console.log('Image placed successfully');
                continue;
            }

            // â€¦otherwise (VS Code file:// or no project), fall back to in-memory load
            if (!fileName && window.electronAPI?.addImage) {
                // In Electron but no project open: keep your original UX
                alert('Open or create a file first so I know which media folder to use.');
                continue;
            }

            // Pure browser / no Electron / no project: load directly
            await placeImageFile(f); // your existing helper handles Fabric/DOM add
        }

        // allow picking the same file again later
        fileInput.value = '';
    });

    async function placeImageFromProjectMedia(fileName, relPath, displayName) {
        // Get the bytes from main
        const buf = await window.electronAPI?.getImage?.(fileName, relPath);
        if (!buf) return;

        // Turn it into a Blob URL so Fabric/DOM can load it
        const blob = new Blob([buf]);
        const url = URL.createObjectURL(blob);

        if (hasFabric()) {
            const fc = ensureFabric();
            await new Promise((resolve) => {
                fabric.Image.fromURL(url, (img) => {
                    const rect = scene.getBoundingClientRect();
                    const maxW = rect.width * 0.4;
                    const maxH = rect.height * 0.4;
                    const sc = Math.min(maxW / img.width, maxH / img.height, 1);
                    img.scale(sc);
                    const elementID = window.generateElementID?.('image') || 'unknown';
                    img.set({
                        left: rect.width / 2,
                        top: rect.height / 2,
                        originX: 'center',
                        originY: 'center',
                        selectable: true,
                        hasControls: true,
                        hasBorders: true,
                        customImagePath: relPath,
                        customImageName: displayName || relPath.split('/').pop(),
                        elementID: elementID  // NEW: Add ElementID
                    });
                    fc.add(img);
                    fc.setActiveObject(img);
                    fc.requestRenderAll();

                    // Register in Scene Resources using the saved name
                    try {
                        window.SceneResources?.add?.('images', {
                            id: img.__uid || crypto.randomUUID?.() || String(Date.now() + Math.random()),
                            name: displayName || relPath.split('/').pop(),
                            meta: { width: img.width, height: img.height, path: relPath }
                        });
                    } catch { }
                    resolve();
                }, { crossOrigin: 'anonymous' });
            });
        } else {
            // (Optional) DOM fallback if Fabric isn't available
            const img = document.createElement('img');
            img.src = url;
            img.alt = displayName || relPath.split('/').pop();
            img.draggable = false;
            img.className = 'scene-image selectable';
            Object.assign(img.style, {
                position: 'absolute',
                maxWidth: '40%',
                maxHeight: '40%',
                boxShadow: '0 6px 24px rgba(0,0,0,.25)',
                borderRadius: '6px',
                userSelect: 'none',
                pointerEvents: 'auto'
            });
            img.addEventListener('load', () => {
                scene.appendChild(img);
                const sceneW = scene.clientWidth;
                const sceneH = scene.clientHeight;
                const left = (sceneW - img.offsetWidth) / 2;
                const top = (sceneH - img.offsetHeight) / 2;
                img.style.left = `${left}px`;
                img.style.top = `${top}px`;
                makeDOMDraggable(img);
                try {
                    window.SceneResources?.add?.('images', {
                        id: crypto.randomUUID?.() || String(Date.now() + Math.random()),
                        name: displayName || relPath.split('/').pop(),
                        meta: { width: img.naturalWidth, height: img.naturalHeight, path: relPath }
                    });
                } catch { }
            }, { once: true });
        }
    }

    // Expose helper to restore images from saved paths
    window.restoreImageFromPath = async function (fileName, relPath) {
        console.log('restoreImageFromPath called with:', { fileName, relPath });

        if (!window.electronAPI?.getImage) {
            console.error('electronAPI.getImage is not available');
            return null;
        }

        try {
            const buf = await window.electronAPI.getImage(fileName, relPath);
            console.log('getImage returned buffer:', buf ? `${buf.byteLength} bytes` : 'null');

            if (!buf) {
                console.error('No buffer returned for image:', relPath);
                return null;
            }

            const blob = new Blob([buf]);
            const url = URL.createObjectURL(blob);
            console.log('Created blob URL:', url);
            return url;
        } catch (error) {
            console.error('Error in restoreImageFromPath:', error);
            return null;
        }
    };

    async function placeImageFile(file) {
        const url = URL.createObjectURL(file);

        if (hasFabric()) {
            const fc = ensureFabric();
            await new Promise((resolve, reject) => {
                fabric.Image.fromURL(url, (img) => {
                    // Scale down big images to a nice starting size
                    const rect = scene.getBoundingClientRect();
                    const maxW = rect.width * 0.4;
                    const maxH = rect.height * 0.4;
                    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
                    img.scale(scale);

                    // Center on the visible scene
                    const elementID = window.generateElementID?.('image') || 'unknown';
                    img.set({
                        left: rect.width / 2,
                        top: rect.height / 2,
                        originX: 'center',
                        originY: 'center',
                        selectable: true,
                        hasControls: true,
                        hasBorders: true,
                        customImagePath: file.name,
                        customImageName: file.name,
                        elementID: elementID  // NEW: Add ElementID
                    });

                    // Make it draggable/resizable immediately
                    fc.add(img);
                    fc.setActiveObject(img);
                    fc.requestRenderAll();

                    // Register in Scene Resources
                    try {
                        window.SceneResources?.add?.('images', {
                            id: img.__uid || crypto.randomUUID?.() || String(Date.now() + Math.random()),
                            name: file.name,
                            meta: { width: img.width, height: img.height }
                        });
                    } catch { }

                    resolve();
                }, { crossOrigin: 'anonymous' });
            });
        } else {
            // DOM fallback: create a positioned <img> inside #actual-canvas
            const img = document.createElement('img');
            img.src = url;
            img.alt = file.name;
            img.draggable = false;
            img.className = 'scene-image selectable';
            Object.assign(img.style, {
                position: 'absolute',
                maxWidth: '40%',
                maxHeight: '40%',
                boxShadow: '0 6px 24px rgba(0,0,0,.25)',
                borderRadius: '6px',
                userSelect: 'none',
                pointerEvents: 'auto'
            });

            img.addEventListener('load', () => {
                // Center it within the scene
                scene.appendChild(img); // attach first so offset sizes are available

                const sceneW = scene.clientWidth;   // content-space width
                const sceneH = scene.clientHeight;  // content-space height
                const w = img.offsetWidth;          // content-space size (ignores transform)
                const h = img.offsetHeight;

                const left = (sceneW - w) / 2;
                const top = (sceneH - h) / 2;

                img.style.left = `${left}px`;
                img.style.top = `${top}px`;

                // Very light draggable behavior (until Fabric is added)
                makeDOMDraggable(img);

                // Register in Scene Resources
                try {
                    window.SceneResources?.add?.('images', {
                        id: crypto.randomUUID?.() || String(Date.now() + Math.random()),
                        name: file.name,
                        meta: { width: img.naturalWidth, height: img.naturalHeight }
                    });
                } catch { }
            }, { once: true });
        }
    }

    function makeDOMDraggable(el) {
        let dragging = false;
        let startMouseX = 0, startMouseY = 0;   // mouse in content space at mousedown
        let startElX = 0, startElY = 0;         // element left/top in content space

        const scene = document.getElementById('actual-canvas');

        function getView() {
            const v = window.__canvasView || { scale: 1, tx: 0, ty: 0 };
            return v;
        }

        // Convert screen (client) coords to content coords using X = (screen - tx)/scale
        function toContentCoords(clientX, clientY) {
            const { scale, tx, ty } = getView();
            const rect = scene.getBoundingClientRect();   // screen-space of scene
            const sx = clientX - rect.left;               // screen coords relative to scene
            const sy = clientY - rect.top;
            return {
                x: (sx - tx) / scale,
                y: (sy - ty) / scale
            };
        }

        const onDown = (e) => {
            if (e.button !== 0) return; // left click only
            e.preventDefault();
            dragging = true;

            // Mouse start in content space
            const m = toContentCoords(e.clientX, e.clientY);
            startMouseX = m.x;
            startMouseY = m.y;

            // Element start position (left/top are already content-space CSS px)
            startElX = parseFloat(el.style.left || '0');
            startElY = parseFloat(el.style.top || '0');

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp, { once: true });
            el.style.cursor = 'grabbing';
        };

        const onMove = (e) => {
            if (!dragging) return;
            const m = toContentCoords(e.clientX, e.clientY);
            const dx = m.x - startMouseX;
            const dy = m.y - startMouseY;
            el.style.left = `${startElX + dx}px`;
            el.style.top = `${startElY + dy}px`;
        };

        const onUp = () => {
            dragging = false;
            document.removeEventListener('mousemove', onMove);
            el.style.cursor = 'default';
        };

        el.addEventListener('mousedown', onDown);
    }
})();

