(() => {
    const wrapper = document.getElementById('canvas-wrapper');
    const scene = document.getElementById('actual-canvas');
    const videoInput = document.getElementById('videoInput');

    window.addVideo = function addVideo() {
        videoInput.click();
    };

    videoInput.addEventListener('change', async (e) => {
        const picked = Array.from(e.target.files || []);

        if (!picked.length) {
            videoInput.value = '';
            return;
        }

        const fileName = window.currentFile?.name;

        for (const f of picked) {
            if (!f.type.startsWith('video/')) continue;

            console.log('Processing video file:', f.name);

            if (window.electronAPI?.addVideo && fileName) {
                console.log('Using Electron media pipeline for video:', f.name);
                const srcPath = f.path;

                const res = await window.electronAPI.addVideo({ fileName, videoPath: srcPath });
                console.log('addVideo response:', res);

                if (!res || !res.success) {
                    console.error('Failed to add video:', res?.error);
                    continue;
                }

                const relPath = res.relativePath;
                // Load the video from backend to get blob URL
                const buf = await window.electronAPI.getVideo(fileName, relPath);
                if (!buf) {
                    console.error('Failed to load video buffer');
                    continue;
                }

                const blob = new Blob([buf]);
                const blobUrl = URL.createObjectURL(blob);

                // Create video but store simple path
                await createVideoElement(blobUrl, relPath, f.name);
                continue;
            }

            if (!fileName && window.electronAPI?.addVideo) {
                alert('Open or create a file first so I know which media folder to use.');
                continue;
            }

            await placeVideoFile(f);
        }

        videoInput.value = '';
    });

    async function placeVideoFile(file) {
        const url = URL.createObjectURL(file);
        await createVideoElement(url, file.name, file.name);
    }

    async function createVideoElement(blobUrl, simplePath, displayName) {
        const fc = window.getFabric?.();

        if (fc) {
            console.log('Creating video element from blob, storing path:', simplePath);

            // Create a video element with blob URL
            const videoEl = document.createElement('video');
            videoEl.src = blobUrl;
            videoEl.crossOrigin = 'anonymous';
            videoEl.muted = true;
            videoEl.loop = true;
            videoEl.preload = 'metadata';

            console.log('Video element created, waiting for metadata...');

            try {
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        reject(new Error('Video load timeout after 10 seconds'));
                    }, 10000);

                    videoEl.addEventListener('loadedmetadata', () => {
                        clearTimeout(timeout);
                        console.log('Video metadata loaded:', {
                            width: videoEl.videoWidth,
                            height: videoEl.videoHeight,
                            duration: videoEl.duration,
                            readyState: videoEl.readyState
                        });
                        resolve();
                    }, { once: true });

                    videoEl.addEventListener('error', (e) => {
                        clearTimeout(timeout);
                        console.error('Video load error:', e, videoEl.error);
                        reject(videoEl.error || new Error('Video failed to load'));
                    }, { once: true });

                    videoEl.addEventListener('loadeddata', () => {
                        if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
                            clearTimeout(timeout);
                            console.log('Video data loaded (fallback)');
                            resolve();
                        }
                    }, { once: true });
                });

                if (videoEl.videoWidth === 0 || videoEl.videoHeight === 0) {
                    throw new Error(`Invalid video dimensions: ${videoEl.videoWidth}x${videoEl.videoHeight}`);
                }

                // Attach video to DOM (hidden) so it can render
                videoEl.style.position = 'absolute';
                videoEl.style.top = '-9999px';
                videoEl.style.left = '-9999px';
                videoEl.style.visibility = 'hidden';
                document.body.appendChild(videoEl);

                // Start playing
                await videoEl.play().catch(err => {
                    console.warn('Video autoplay blocked:', err);
                });

                console.log('Creating offscreen canvas for video rendering...');

                // Create an offscreen canvas to draw video frames
                const videoCanvas = document.createElement('canvas');
                videoCanvas.width = videoEl.videoWidth;
                videoCanvas.height = videoEl.videoHeight;
                const videoCtx = videoCanvas.getContext('2d');

                console.log('Creating Fabric image from canvas...');

                // Create Fabric image from the canvas (not the video directly)
                const fabricVideo = new fabric.Image(videoCanvas, {
                    left: scene.getBoundingClientRect().width / 2,
                    top: scene.getBoundingClientRect().height / 2,
                    originX: 'center',
                    originY: 'center',
                    selectable: true,
                    hasControls: true,
                    hasBorders: true,
                    objectCaching: false
                });

                // Store references for the render loop
                fabricVideo.videoElement = videoEl;
                fabricVideo.videoCanvas = videoCanvas;
                fabricVideo.videoContext = videoCtx;
                fabricVideo.isVideo = true;

                console.log('Fabric video created, dimensions:', {
                    width: fabricVideo.width,
                    height: fabricVideo.height,
                    scaleX: fabricVideo.scaleX,
                    scaleY: fabricVideo.scaleY
                });

                // Scale to reasonable size
                const rect = scene.getBoundingClientRect();
                const maxW = rect.width * 0.4;
                const maxH = rect.height * 0.4;
                const scale = Math.min(maxW / videoEl.videoWidth, maxH / videoEl.videoHeight, 1);

                console.log('Calculated scale:', scale);
                fabricVideo.scale(scale);

                // Generate ElementID
                const elementID = window.generateElementID?.('video') || 'unknown';
                console.log('Generated ElementID:', elementID);

                // Store simple path (not blob URL) and blob URL separately
                fabricVideo.set({
                    customVideoPath: simplePath,  // Store simple path like "media/video.mp4"
                    customVideoBlobUrl: blobUrl,   // Keep blob URL for reference
                    customVideoName: displayName || simplePath.split('/').pop(),
                    elementID: elementID
                });

                // Add to canvas
                console.log('Adding video to Fabric canvas...');
                fc.add(fabricVideo);
                fc.setActiveObject(fabricVideo);
                fc.requestRenderAll();

                console.log('Video added successfully with path:', simplePath);

                // Start the video frame rendering loop
                if (!window.__videoRenderLoopStarted) {
                    window.__videoRenderLoopStarted = true;
                    console.log('Starting video render loop');

                    function renderVideoFrames() {
                        const objects = fc.getObjects();
                        objects.forEach(obj => {
                            if (obj.isVideo && obj.videoElement && !obj.videoElement.paused) {
                                // Draw current video frame to the canvas
                                obj.videoContext.drawImage(
                                    obj.videoElement,
                                    0, 0,
                                    obj.videoCanvas.width,
                                    obj.videoCanvas.height
                                );
                                obj.dirty = true;
                            }
                        });
                        fc.requestRenderAll();
                        requestAnimationFrame(renderVideoFrames);
                    }
                    requestAnimationFrame(renderVideoFrames);
                }

                // Register in Scene Resources
                try {
                    window.SceneResources?.add?.('videos', {
                        id: fabricVideo.__uid || crypto.randomUUID?.() || String(Date.now() + Math.random()),
                        name: displayName || simplePath.split('/').pop(),
                        meta: {
                            width: videoEl.videoWidth,
                            height: videoEl.videoHeight,
                            path: simplePath,  // Store simple path
                            duration: videoEl.duration
                        }
                    });
                    console.log('Video registered in Scene Resources');
                } catch (err) {
                    console.error('Failed to register video in resources:', err);
                }

            } catch (err) {
                console.error('Failed to create video:', err);
                alert('Failed to load video: ' + err.message);
            }

        } else {
            // DOM fallback
            const videoEl = document.createElement('video');
            videoEl.src = blobUrl;
            videoEl.controls = true;
            videoEl.muted = true;
            videoEl.loop = true;
            videoEl.className = 'scene-video selectable';

            Object.assign(videoEl.style, {
                position: 'absolute',
                maxWidth: '40%',
                maxHeight: '40%',
                boxShadow: '0 6px 24px rgba(0,0,0,.25)',
                borderRadius: '6px',
                userSelect: 'none',
                pointerEvents: 'auto'
            });

            videoEl.addEventListener('loadedmetadata', () => {
                scene.appendChild(videoEl);

                const sceneW = scene.clientWidth;
                const sceneH = scene.clientHeight;
                const left = (sceneW - videoEl.offsetWidth) / 2;
                const top = (sceneH - videoEl.offsetHeight) / 2;

                videoEl.style.left = `${left}px`;
                videoEl.style.top = `${top}px`;

                makeDOMDraggable(videoEl);
                videoEl.play();

                try {
                    window.SceneResources?.add?.('videos', {
                        id: crypto.randomUUID?.() || String(Date.now() + Math.random()),
                        name: displayName || simplePath.split('/').pop(),
                        meta: {
                            width: videoEl.videoWidth,
                            height: videoEl.videoHeight,
                            path: simplePath,
                            duration: videoEl.duration
                        }
                    });
                } catch (err) {
                    console.error('Failed to register video:', err);
                }
            }, { once: true });
        }
    }

    // Restore function - loads buffer and creates blob URL, returns it
    window.restoreVideoFromPath = async function (fileName, relPath) {
        console.log('restoreVideoFromPath called with:', { fileName, relPath });

        if (!window.electronAPI?.getVideo) {
            console.error('electronAPI.getVideo is not available');
            return null;
        }

        try {
            const buf = await window.electronAPI.getVideo(fileName, relPath);
            console.log('getVideo returned buffer:', buf ? `${buf.byteLength} bytes` : 'null');

            if (!buf) {
                console.error('No buffer returned for video:', relPath);
                return null;
            }

            const blob = new Blob([buf], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            console.log('Created video blob URL for path:', relPath);
            return url;
        } catch (error) {
            console.error('Error in restoreVideoFromPath:', error);
            return null;
        }
    };

    function makeDOMDraggable(el) {
        let dragging = false;
        let startMouseX = 0, startMouseY = 0;
        let startElX = 0, startElY = 0;

        const scene = document.getElementById('actual-canvas');

        function getView() {
            const v = window.__canvasView || { scale: 1, tx: 0, ty: 0 };
            return v;
        }

        function toContentCoords(clientX, clientY) {
            const { scale, tx, ty } = getView();
            const rect = scene.getBoundingClientRect();
            const sx = clientX - rect.left;
            const sy = clientY - rect.top;
            return {
                x: (sx - tx) / scale,
                y: (sy - ty) / scale
            };
        }

        const onDown = (e) => {
            if (e.button !== 0) return;
            e.preventDefault();
            dragging = true;

            const m = toContentCoords(e.clientX, e.clientY);
            startMouseX = m.x;
            startMouseY = m.y;

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