function addBackground() {
  showLayerManagementPopup();
}

function showLayerManagementPopup() {
  // Remove existing popup if it exists
  const existingPopup = document.getElementById('layer-management-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'layer-management-popup';
  popup.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

  // Create popup content
  const popupContent = document.createElement('div');
  popupContent.style.cssText = `
    background: white;
    border-radius: 8px;
    padding: 20px;
    width: 400px;
    max-height: 600px;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;

  // Create header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  `;

  const title = document.createElement('h3');
  title.textContent = 'Layer Management';
  title.style.margin = '0';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  closeBtn.onclick = () => popup.remove();

  header.appendChild(title);
  header.appendChild(closeBtn);

  // Create add layer button
  const addLayerBtn = document.createElement('button');
  addLayerBtn.textContent = '+ Add Layer';
  addLayerBtn.style.cssText = `
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 15px;
    font-size: 14px;
  `;
  addLayerBtn.onclick = () => addNewLayer();

  // Create layers container
  const layersContainer = document.createElement('div');
  layersContainer.id = 'layers-container';
  layersContainer.style.cssText = `
    margin-bottom: 20px;
    min-height: 200px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
  `;

  // Create action buttons container
  const actionButtons = document.createElement('div');
  actionButtons.style.cssText = `
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  `;

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.cssText = `
    padding: 8px 16px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  cancelBtn.onclick = () => popup.remove();

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.style.cssText = `
    padding: 8px 16px;
    background: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  saveBtn.onclick = () => saveLayerChanges();

  actionButtons.appendChild(cancelBtn);
  actionButtons.appendChild(saveBtn);

  // Assemble popup
  popupContent.appendChild(header);
  popupContent.appendChild(addLayerBtn);
  popupContent.appendChild(layersContainer);
  popupContent.appendChild(actionButtons);
  popup.appendChild(popupContent);

  // Add to document
  document.body.appendChild(popup);

  // Initialize layers display
  displayLayers();
}

function displayLayers() {
  const container = document.getElementById('layers-container');
  if (!container) return;

  // Initialize layers array if it doesn't exist
  if (!pages[currentPage].layers) {
    pages[currentPage].layers = [];
  }

  // Clear the container first
  container.innerHTML = '';

  // Debug: Log the layers to console
  console.log('Current page:', currentPage);
  console.log('Layers for current page:', pages[currentPage].layers);

  if (pages[currentPage].layers.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.textContent = 'No layers added yet. Click "Add Layer" to get started.';
    emptyMessage.style.cssText = `
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 20px;
    `;
    container.appendChild(emptyMessage);
    return;
  }

  // Create a layer item for each layer
  pages[currentPage].layers.forEach((layer, index) => {
    console.log(`Creating layer item ${index}:`, layer);
    
    const layerItem = document.createElement('div');
    layerItem.style.cssText = `
      display: flex;
      align-items: center;
      padding: 10px;
      margin-bottom: 8px;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
    `;

    // Drag handle
    const dragHandle = document.createElement('div');
    dragHandle.textContent = '⋮⋮';
    dragHandle.style.cssText = `
      cursor: grab;
      margin-right: 10px;
      color: #666;
      font-weight: bold;
    `;

    // Layer thumbnail
    const thumbnail = document.createElement('div');
    thumbnail.style.cssText = `
      width: 50px;
      height: 40px;
      margin-right: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-image: url('${layer.url}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      flex-shrink: 0;
    `;

    // Layer info
    const layerInfo = document.createElement('div');
    layerInfo.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
    `;

    // Layer number and name
    const layerLabel = document.createElement('div');
    layerLabel.textContent = `Layer ${index + 1}`;
    layerLabel.style.cssText = `
      font-weight: bold;
      margin-bottom: 2px;
      color: #333;
      font-size: 14px;
    `;

    const layerName = document.createElement('div');
    layerName.textContent = layer.name || 'Untitled';
    layerName.style.cssText = `
      margin-bottom: 2px;
      color: #555;
      font-size: 12px;
    `;

    const layerType = document.createElement('div');
    layerType.textContent = layer.type || 'Background';
    layerType.style.cssText = `
      font-size: 11px;
      color: #888;
    `;

    // Visibility toggle
    const visibilityContainer = document.createElement('div');
    visibilityContainer.style.cssText = `
      display: flex;
      align-items: center;
      margin-top: 4px;
    `;

    const visibilityCheckbox = document.createElement('input');
    visibilityCheckbox.type = 'checkbox';
    visibilityCheckbox.checked = layer.visible !== false; // Default to visible if not specified
    visibilityCheckbox.style.cssText = `
      margin-right: 5px;
    `;
    visibilityCheckbox.onchange = () => toggleLayerVisibility(index);

    const visibilityLabel = document.createElement('span');
    visibilityLabel.textContent = 'Visible';
    visibilityLabel.style.cssText = `
      font-size: 11px;
      color: #666;
    `;

    visibilityContainer.appendChild(visibilityCheckbox);
    visibilityContainer.appendChild(visibilityLabel);

    layerInfo.appendChild(layerLabel);
    layerInfo.appendChild(layerName);
    layerInfo.appendChild(layerType);
    layerInfo.appendChild(visibilityContainer);

    // Buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      gap: 5px;
    `;

    // Move up button
    const moveUpBtn = document.createElement('button');
    moveUpBtn.textContent = '↑';
    moveUpBtn.style.cssText = `
      padding: 4px 8px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    `;
    moveUpBtn.onclick = () => moveLayer(index, index - 1);
    moveUpBtn.disabled = index === 0;
    if (moveUpBtn.disabled) {
      moveUpBtn.style.background = '#ccc';
      moveUpBtn.style.cursor = 'not-allowed';
    }

    // Move down button
    const moveDownBtn = document.createElement('button');
    moveDownBtn.textContent = '↓';
    moveDownBtn.style.cssText = `
      padding: 4px 8px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    `;
    moveDownBtn.onclick = () => moveLayer(index, index + 1);
    moveDownBtn.disabled = index === pages[currentPage].layers.length - 1;
    if (moveDownBtn.disabled) {
      moveDownBtn.style.background = '#ccc';
      moveDownBtn.style.cursor = 'not-allowed';
    }

    // Edit button (placeholder for now)
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.style.cssText = `
      padding: 4px 8px;
      background: #ffc107;
      color: black;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    `;
    editBtn.onclick = () => {
      alert('Edit functionality will be implemented later');
    };

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.style.cssText = `
      padding: 4px 8px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
    `;
    deleteBtn.onclick = () => deleteLayer(index);

    buttonsContainer.appendChild(moveUpBtn);
    buttonsContainer.appendChild(moveDownBtn);
    buttonsContainer.appendChild(editBtn);
    buttonsContainer.appendChild(deleteBtn);

    layerItem.appendChild(dragHandle);
    layerItem.appendChild(thumbnail);
    layerItem.appendChild(layerInfo);
    layerItem.appendChild(buttonsContainer);

    container.appendChild(layerItem);
  });
}

function addNewLayer() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  
  input.onchange = function () {
    const file = input.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function (e) {
      const url = e.target.result;
      
      // Initialize layers array if it doesn't exist
      if (!pages[currentPage].layers) {
        pages[currentPage].layers = [];
      }
      
      // Add new layer to the array
      const newLayer = {
        name: file.name.split('.')[0], // Remove extension
        type: 'Background',
        url: url,
        filename: file.name,
        visible: true,
        zIndex: pages[currentPage].layers.length
      };
      
      pages[currentPage].layers.push(newLayer);
      
      console.log('Added new layer:', newLayer);
      console.log('Total layers now:', pages[currentPage].layers.length);
      
      // Refresh the layers display
      displayLayers();
    };
    reader.readAsDataURL(file);
  };
  
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

function moveLayer(fromIndex, toIndex) {
  if (!pages[currentPage].layers) return;
  if (toIndex < 0 || toIndex >= pages[currentPage].layers.length) return;
  
  const layers = pages[currentPage].layers;
  const layerToMove = layers.splice(fromIndex, 1)[0];
  layers.splice(toIndex, 0, layerToMove);
  
  // Update z-index values
  layers.forEach((layer, index) => {
    layer.zIndex = index;
  });
  
  displayLayers();
  
  // Immediately update the canvas preview
  const canvas = document.getElementById('actual-canvas');
  if (canvas) {
    clearExistingLayers(canvas);
    createLayeredBackground(canvas);
  }
}

function deleteLayer(index) {
  if (!pages[currentPage].layers) return;
  if (confirm('Are you sure you want to delete this layer?')) {
    pages[currentPage].layers.splice(index, 1);
    displayLayers();
  }
}

function toggleLayerVisibility(index) {
  if (!pages[currentPage].layers || !pages[currentPage].layers[index]) return;
  
  pages[currentPage].layers[index].visible = !pages[currentPage].layers[index].visible;
  
  // Immediately update the canvas preview (optional - you could wait for Save)
  const canvas = document.getElementById('actual-canvas');
  if (canvas) {
    clearExistingLayers(canvas);
    createLayeredBackground(canvas);
  }
}

function clearExistingLayers(canvas) {
  // Remove all existing background layer elements
  const existingLayers = canvas.querySelectorAll('.background-layer');
  existingLayers.forEach(layer => layer.remove());
  
  // Ensure canvas container is positioned relatively for absolute positioning of layers
  canvas.style.position = 'relative';
  canvas.style.zIndex = '1'; // Establish stacking context above background layers
}

// FIXED: Single createLayeredBackground function (removed duplicate)
function createLayeredBackground(canvas) {
  if (!pages[currentPage].layers || pages[currentPage].layers.length === 0) return;
  
  // Ensure canvas is positioned relatively and has proper stacking context
  canvas.style.position = 'relative';
  canvas.style.zIndex = '1'; // Establish stacking context above background layers
  
  // Sort layers by z-index (bottom to top)
  const sortedLayers = [...pages[currentPage].layers].sort((a, b) => a.zIndex - b.zIndex);
  
  sortedLayers.forEach((layer, index) => {
    if (!layer.visible) return; // Skip invisible layers
    
    const layerElement = document.createElement('div');
    layerElement.className = 'background-layer';
    layerElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${layer.url}');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      z-index: ${-100 + index}; /* Negative z-index to stay behind canvas content */
      pointer-events: none;
    `;
    
    // Add layer identification for debugging/management
    layerElement.dataset.layerName = layer.name;
    layerElement.dataset.layerZIndex = layer.zIndex;
    
    canvas.appendChild(layerElement);
  });
}

function saveLayerChanges() {
  // Apply the layers to the canvas
  const canvas = document.getElementById('actual-canvas');
  if (!canvas) return;
  
  // Clear existing background and layer elements
  canvas.style.backgroundImage = '';
  clearExistingLayers(canvas);
  
  if (pages[currentPage].layers && pages[currentPage].layers.length > 0) {
    // Create layered background elements
    createLayeredBackground(canvas);
    
    // Update page meta for compatibility with existing code (use bottom layer)
    const bottomLayer = pages[currentPage].layers[0];
    if (!pages[currentPage].meta) pages[currentPage].meta = {};
    pages[currentPage].meta.backgroundFilename = bottomLayer.filename;
    pages[currentPage].meta.backgroundDataURL = bottomLayer.url;
  } else {
    // If no layers, restore original background if it exists
    if (pages[currentPage].meta && pages[currentPage].meta.backgroundDataURL) {
      canvas.style.backgroundImage = `url('${pages[currentPage].meta.backgroundDataURL}')`;
      canvas.style.backgroundSize = 'contain';
      canvas.style.backgroundPosition = 'center';
      canvas.style.backgroundRepeat = 'no-repeat';
    }
  }
  
  // Close popup
  const popup = document.getElementById('layer-management-popup');
  if (popup) popup.remove();
  
  // Refresh elements popup if it's open
  const pagePopup = document.getElementById('page-popup');
  if (pagePopup && pagePopup.style.display !== 'none') {
    const activeTab = pagePopup.querySelector('[style*="background: white"]');
    if (activeTab && activeTab.textContent === 'Elements') {
      activeTab.onclick();
    }
  }
}