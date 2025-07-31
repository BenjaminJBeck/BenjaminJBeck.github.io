function updatePageLabel() {
  const pageName = pages[currentPage]?.name || `Page ${currentPage}`;
  document.getElementById('page-label').textContent = pageName;
}
function renderPageButtons() {
  const container = document.getElementById('page-buttons');
  container.innerHTML = '';
  const plusBtn = document.createElement('div');
  plusBtn.className = 'page-button';
  plusBtn.textContent = '+';
  plusBtn.onclick = addPage;
  container.appendChild(plusBtn);
  
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('div');
    let classes = 'page-button';
    if (i === currentPage) classes += ' selected';
    if (i === selectedPageForDelete) classes += ' to-delete';
    btn.className = classes;
    
    // Use custom name if available, otherwise use page number
    const pageName = pages[i]?.name || `${i}`;
    btn.textContent = pageName;
    
    // Make draggable
    btn.draggable = true;
    btn.dataset.pageNum = i;
    
    btn.onclick = () => setPage(i);
    btn.ondblclick = (e) => {
  e.stopPropagation();

  // If a popup is already open, remove it first
  const existing = document.getElementById('page-popup');
  if (existing) existing.remove();

  openPagePopup(i);
};
    
    // Drag event listeners
    btn.ondragstart = (e) => {
      e.dataTransfer.setData('text/plain', i);
      btn.classList.add('dragging');
    };
    
    btn.ondragend = (e) => {
      btn.classList.remove('dragging');
    };
    
    btn.ondragover = (e) => {
  e.preventDefault();
  btn.classList.add('drag-over');
};

btn.ondragleave = () => {
  btn.classList.remove('drag-over');
};

btn.ondrop = (e) => {
  e.preventDefault();
  btn.classList.remove('drag-over');
  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
  const toIndex = i;

  if (fromIndex !== toIndex) {
    reorderPages(fromIndex, toIndex);
    renderPageButtons();
  }
};
    
    // Add visual styling for selected button
    if (i === currentPage) {
      btn.style.backgroundColor = '#00cfee';
      btn.style.color = '#003d4a';
      btn.style.border = '3px solid #00cfee';
      btn.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.4)';
      btn.style.transform = 'scale(1.1)';
    }
    
    container.appendChild(btn);
  }
}
function reorderPages(from, to) {
  const keys = Object.keys(pages).map(Number).sort((a, b) => a - b);
  const movedPage = pages[from];

  keys.splice(keys.indexOf(from), 1); // Remove from old position
  keys.splice(keys.indexOf(to), 0, from); // Insert at new position

  const newPages = {};
  let newIndex = 1;
  for (const key of keys) {
    newPages[newIndex] = pages[key === from ? from : key];
    if (key === from) {
      newPages[newIndex] = movedPage;
    }
    newIndex++;
  }

  pages = newPages;
  totalPages = Object.keys(pages).length;
  currentPage = to;
}
function handlePageButtonClick(num) {
  if (num === selectedPageForDelete) {
    selectedPageForDelete = null;
  } else if (num === currentPage) {
    selectedPageForDelete = num;
  } else {
    selectedPageForDelete = null;
    setPage(num);
  }
  renderPageButtons();
}
function setPage(num) {
  currentPage = num;
  updatePageLabel();
  renderPageButtons();
  loadScene(num);
  
  // NEW: If popup is open, update it to show the new page
  const existingPopup = document.getElementById('page-popup');
  if (existingPopup) {
    existingPopup.remove();
    openPagePopup(num);
  }
}
function addPage() {
  totalPages += 1;
  pages[totalPages] = [];
  currentPage = totalPages;
  updatePageLabel();
  renderPageButtons();
  loadScene(currentPage);
  
  // NEW: If popup is open, update it to show the new page
  const existingPopup = document.getElementById('page-popup');
  if (existingPopup) {
    existingPopup.remove();
    openPagePopup(currentPage);
  }
}
function loadScene(page) {
  const canvas = document.getElementById("actual-canvas");
  if (canvas) {
    canvas.innerHTML = '';
    
    // Clear any old background styles
    canvas.style.backgroundImage = '';
    canvas.style.backgroundSize = '';
    canvas.style.backgroundPosition = '';
    canvas.style.backgroundRepeat = '';
    
    // Check if page has layers (new system)
    if (pages[page]?.layers && pages[page].layers.length > 0) {
      // Use the new layered background system
      clearExistingLayers(canvas);
      createLayeredBackground(canvas);
    } else {
      // Fallback to old single background system for backward compatibility
      const bg = pages[page]?.meta?.backgroundDataURL || '';
      if (bg) {
        canvas.style.backgroundImage = `url('${bg}')`;
        canvas.style.backgroundSize = 'contain';
        canvas.style.backgroundPosition = 'center';
        canvas.style.backgroundRepeat = 'no-repeat';
      }
    }
    
    // Restore all elements for this page
    (pages[page] || []).forEach(el => {
      if (el instanceof Element) {
        canvas.appendChild(el);
      }
    });
  }
}
function deletePageByDrag(pageNum) {
  if (totalPages === 1) {
    alert("Can't delete the last page.");
    return;
  }
  
  if (confirm(`Delete page ${pages[pageNum]?.name || pageNum}?`)) {
    delete pages[pageNum];
    const newPages = {};
    let index = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (pages[i]) newPages[index++] = pages[i];
    }
    pages = newPages;
    totalPages = index - 1;
    
    // If we deleted the current page, switch to a valid page
    if (pageNum === currentPage) {
      currentPage = Math.min(currentPage, totalPages);
    } else if (pageNum < currentPage) {
      currentPage = currentPage - 1;
    }
    
    selectedPageForDelete = null;
    updatePageLabel();
    renderPageButtons();
    loadScene(currentPage);
  }
}
function setupTrashCan() {
  const trashCan = document.getElementById('trash-can');
  
  trashCan.ondragover = (e) => {
    e.preventDefault();
    trashCan.classList.add('drag-over');
  };
  
  trashCan.ondragleave = (e) => {
    trashCan.classList.remove('drag-over');
  };
  
  trashCan.ondrop = (e) => {
    e.preventDefault();
    trashCan.classList.remove('drag-over');
    const pageNum = parseInt(e.dataTransfer.getData('text/plain'));
    if (pageNum) {
      deletePageByDrag(pageNum);
    }
  };
}
function createElementsContent(isGlobal = false) {
  const container = document.createElement('div');
  // Match the styling of other tab content
  container.style.padding = '30px';
  container.style.fontSize = '18px';
  container.style.height = '100%';
  container.style.overflowY = 'auto';
  container.style.boxSizing = 'border-box';

  const sections = isGlobal 
    ? ['Background', 'Page Elements', 'Textbox', 'Buttons', 'Container', 'Image Preview', 'Audio']
    : ['Background', 'Page Elements', 'Textbox', 'Buttons', 'Container', 'Image Preview'];

  sections.forEach(sectionName => {
    // Section Header
    const header = document.createElement('div');
    header.textContent = sectionName;
    Object.assign(header.style, {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#007ea6',
      marginBottom: '10px',
      marginTop: sectionName === sections[0] ? '0px' : '25px',
      borderBottom: '2px solid #007ea6',
      paddingBottom: '5px'
    });
    container.appendChild(header);

    // Section Content
    const content = document.createElement('div');
    Object.assign(content.style, {
      minHeight: '60px',
      background: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '10px'
    });

    if (sectionName === 'Background') {
  // Show all layer backgrounds for this page
  const pageData = pages[currentPage];
  const hasLayers = pageData?.layers && pageData.layers.length > 0;
  
  if (!hasLayers) {
    content.textContent = 'No background layers set for this page.';
    content.style.color = '#6c757d';
    content.style.fontStyle = 'italic';
    content.style.fontSize = '18px';
  } else {
    // Create a grid layout for background icons
    const gridContainer = document.createElement('div');
    Object.assign(gridContainer.style, {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '12px',
      padding: '5px'
    });

    // Display each layer
    pageData.layers.forEach((layer, layerIndex) => {
      const backgroundIcon = document.createElement('div');
      Object.assign(backgroundIcon.style, {
        width: '120px',
        height: '90px',
        border: '2px solid #dee2e6',
        borderRadius: '6px',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        opacity: layer.visible !== false ? '1' : '0.5' // Show visibility state
      });

      // Create name label with format: (Page #).(Layer #)
      const nameLabel = document.createElement('div');
      const pageName = pageData?.name || `Page${currentPage}`;
      const displayName = `(${pageName}).Background.(Layer${layerIndex + 1})`;
      
      nameLabel.textContent = displayName;
      Object.assign(nameLabel.style, {
        fontSize: '10px',
        color: '#333',
        textAlign: 'center',
        marginTop: '3px',
        marginBottom: '3px',
        lineHeight: '1.1',
        maxWidth: '100%',
        overflow: 'hidden',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      });

      // Create small thumbnail
      const thumbnail = document.createElement('img');
      thumbnail.src = layer.url;
      Object.assign(thumbnail.style, {
        width: '100px',
        height: '45px',
        objectFit: 'cover',
        borderRadius: '3px'
      });

      // Create filename label (smaller, below thumbnail)
      const filenameLabel = document.createElement('div');
      const filename = layer.name || layer.filename || 'background';
      filenameLabel.textContent = filename;
      Object.assign(filenameLabel.style, {
        fontSize: '8px',
        color: '#666',
        textAlign: 'center',
        marginTop: '2px',
        lineHeight: '1',
        maxWidth: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      });

      // Add hover effect
      backgroundIcon.addEventListener('mouseenter', () => {
        backgroundIcon.style.borderColor = '#007ea6';
        backgroundIcon.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
      });
      
      backgroundIcon.addEventListener('mouseleave', () => {
        backgroundIcon.style.borderColor = '#dee2e6';
        backgroundIcon.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      });

      // Add click to open layer management
      backgroundIcon.onclick = () => {
        addBackground();
      };

      // Add right-click context menu for delete
      backgroundIcon.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (confirm(`Delete layer "${filename}"?`)) {
          // Remove layer from array
          pageData.layers.splice(layerIndex, 1);
          
          // Update canvas
          const canvas = document.getElementById('actual-canvas');
          if (canvas) {
            clearExistingLayers(canvas);
            if (pageData.layers.length > 0) {
              createLayeredBackground(canvas);
            } else {
              // If no layers left, clear background
              canvas.style.backgroundImage = '';
              canvas.style.backgroundSize = '';
              canvas.style.backgroundPosition = '';
              canvas.style.backgroundRepeat = '';
            }
          }
          
          // Refresh the elements content
          const popup = document.getElementById(isGlobal ? 'global-popup' : 'page-popup');
          if (popup) {
            const activeTab = popup.querySelector('[style*="background: white"]');
            if (activeTab && activeTab.textContent === 'Elements') {
              activeTab.onclick();
            }
          }
        }
      });

      backgroundIcon.appendChild(nameLabel);
      backgroundIcon.appendChild(thumbnail);
      backgroundIcon.appendChild(filenameLabel);
      gridContainer.appendChild(backgroundIcon);
    });
    
    content.appendChild(gridContainer);
  }
} else if (sectionName === 'Page Elements') {
      // Show images based on context (global or page-specific)
      const imagesToShow = isGlobal ? globalImages : (pages[currentPage]?.elements || []);
      
      if (imagesToShow.length === 0) {
        content.textContent = isGlobal ? 'No global images yet.' : 'No elements on this page yet.';
        content.style.color = '#6c757d';
        content.style.fontStyle = 'italic';
        content.style.fontSize = '18px';
      } else {
        // Create a grid layout for image icons like MCreator
        const gridContainer = document.createElement('div');
        Object.assign(gridContainer.style, {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '12px',
          padding: '5px'
        });

        imagesToShow.forEach((imageData, index) => {
          if (imageData.type === 'image') {
            const imageIcon = document.createElement('div');
            Object.assign(imageIcon.style, {
              width: '140px',
              height: '90px',
              border: '2px solid #dee2e6',
              borderRadius: '6px',
              background: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            });

            // Create name label with format: (PageName).(ImageName)(#)
            const nameLabel = document.createElement('div');
            const imageName = imageData.element.dataset.name || 'Unnamed';
            const pageName = pages[imageData.pageNum]?.name || `Page${imageData.pageNum}`;
            const displayName = `(${pageName}).Elements.${imageName}(${index + 1})`;
            
            nameLabel.textContent = displayName;
            Object.assign(nameLabel.style, {
              fontSize: '10px',
              color: '#333',
              textAlign: 'center',
              marginTop: '3px',
              marginBottom: '3px',
              lineHeight: '1.1',
              maxWidth: '100%',
              overflow: 'hidden',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            });

            // Create small thumbnail
            const thumbnail = document.createElement('img');
            thumbnail.src = imageData.element.dataset.dataurl;
            Object.assign(thumbnail.style, {
              width: '120px',
              height: '45px',
              objectFit: 'cover',
              borderRadius: '3px'
            });

            // Create filename label (smaller, below thumbnail)
            const filenameLabel = document.createElement('div');
            filenameLabel.textContent = imageData.filename;
            Object.assign(filenameLabel.style, {
              fontSize: '8px',
              color: '#666',
              textAlign: 'center',
              marginTop: '2px',
              lineHeight: '1',
              maxWidth: '100%',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            });

            // Add hover effect
            imageIcon.addEventListener('mouseenter', () => {
              imageIcon.style.borderColor = '#007ea6';
              imageIcon.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
            });
            
            imageIcon.addEventListener('mouseleave', () => {
              imageIcon.style.borderColor = '#dee2e6';
              imageIcon.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            });

            // Add click to open name popup
            imageIcon.onclick = () => {
              openNamePopupForImage(imageData.element);
            };

            // Add right-click context menu for delete
            imageIcon.addEventListener('contextmenu', (e) => {
              e.preventDefault();
              if (confirm(`Delete "${imageData.filename}"?`)) {
                // Remove from DOM
                if (imageData.element && imageData.element.parentNode) {
                  imageData.element.parentNode.removeChild(imageData.element);
                }
                
                // Remove from global images array
                const globalIndex = globalImages.findIndex(img => img.element === imageData.element);
                if (globalIndex > -1) {
                  globalImages.splice(globalIndex, 1);
                }
                
                // Remove from page-specific arrays
                if (pages[imageData.pageNum]) {
                  const pageIndex = pages[imageData.pageNum].indexOf(imageData.element);
                  if (pageIndex > -1) {
                    pages[imageData.pageNum].splice(pageIndex, 1);
                  }
                  // Remove from elements array
                  if (pages[imageData.pageNum].elements) {
                    const elemIndex = pages[imageData.pageNum].elements.findIndex(el => el.element === imageData.element);
                    if (elemIndex > -1) {
                      pages[imageData.pageNum].elements.splice(elemIndex, 1);
                    }
                  }
                }
                
                // Refresh the elements content
                const popup = document.getElementById(isGlobal ? 'global-popup' : 'page-popup');
                if (popup) {
                  const activeTab = popup.querySelector('[style*="background: white"]');
                  if (activeTab && activeTab.textContent === 'Elements') {
                    activeTab.onclick();
                  }
                }
              }
            });

            imageIcon.setAttribute('data-image-icon', 'true');
            imageIcon.appendChild(nameLabel);
            imageIcon.appendChild(thumbnail);
            imageIcon.appendChild(filenameLabel);
            gridContainer.appendChild(imageIcon);
          }
        });
        
        content.appendChild(gridContainer);
      }
    } else {
      // Placeholder content for other sections
      content.textContent = `${sectionName} content will be implemented here.`;
      content.style.color = '#6c757d';
      content.style.fontStyle = 'italic';
      content.style.fontSize = '18px';
    }

    container.appendChild(content);
  });

  return container;
}
function openPagePopup(pageNum) {
  if (document.getElementById('page-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'page-popup';

  Object.assign(popup.style, {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '100vw',
    height: 'calc(100vh - 90px)',
    background: '#00cfee',
    padding: '20px',
    boxSizing: 'border-box',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Segoe UI, sans-serif'
  });

  // Header Row
  const headerRow = document.createElement('div');
  Object.assign(headerRow.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  });

  // Left: Page Label
  const pageInfo = document.createElement('div');
  pageInfo.style.display = 'flex';
  pageInfo.style.alignItems = 'center';
  
  const nameLabel = document.createElement('div');
  nameLabel.style.background = '#007ea6';
  nameLabel.style.padding = '5px 12px';
  nameLabel.style.borderRadius = '12px';
  nameLabel.style.color = 'white';
  nameLabel.style.fontWeight = 'bold';

  // Initialize with saved name or fallback to "Page N"
  const pageName = pages[pageNum]?.name || `Page ${pageNum}`;
  nameLabel.textContent = pageName;

  pageInfo.innerHTML = `
    <div style="background:#00aee3;padding:5px 10px;border-radius:12px;color:white;margin-right:6px;font-weight:bold;">Page</div>
  `;
  pageInfo.appendChild(nameLabel);

  // Center: Rename Page
  const renameBtn = document.createElement('button');
  renameBtn.textContent = 'Rename Page';
  Object.assign(renameBtn.style, {
    background: '#00aee3',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '6px 16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  });

  renameBtn.onclick = () => {
    // Prevent duplicate popups
    if (document.getElementById('rename-popup')) return;

    const renamePopup = document.createElement('div');
    renamePopup.id = 'rename-popup';
    Object.assign(renamePopup.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#ffffff',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      zIndex: 10001,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: '300px'
    });

    const title = document.createElement('div');
    title.textContent = 'Rename Page';
    Object.assign(title.style, {
      fontWeight: 'bold',
      fontSize: '18px',
      marginBottom: '12px',
      color: '#007ea6'
    });

    const input = document.createElement('input');
    input.value = pages[pageNum]?.name || `Page ${pageNum}`;
    input.maxLength = 8; // Limit to 8 characters
    Object.assign(input.style, {
      padding: '8px 12px',
      width: '100%',
      marginBottom: '16px',
      fontSize: '14px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      outline: 'none'
    });

    const buttonRow = document.createElement('div');
    Object.assign(buttonRow.style, {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      gap: '10px'
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    Object.assign(cancelBtn.style, {
      flex: 1,
      background: '#ccc',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px',
      cursor: 'pointer'
    });
    cancelBtn.onclick = () => renamePopup.remove();

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    Object.assign(saveBtn.style, {
      flex: 1,
      background: '#00aee3',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px',
      fontWeight: 'bold',
      cursor: 'pointer'
    });
    
    saveBtn.onclick = () => {
      const newName = input.value.trim();
      if (newName && newName.length <= 8) {
        // Initialize pages[pageNum] if it doesn't exist
        if (!pages[pageNum]) {
          pages[pageNum] = [];
        }
        
        // Save the new name
        pages[pageNum].name = newName;
        
        // Update the popup's name label
        nameLabel.textContent = newName;
        
        // Update the top page label if this is the current page
        if (pageNum === currentPage) {
          updatePageLabel();
        }
        
        // Update the page buttons
        renderPageButtons();
        
        renamePopup.remove();
      } else if (newName.length > 8) {
        alert('Page name must be 8 characters or less.');
      }
    };

    // Allow Enter key to save
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveBtn.onclick();
      }
    });

    buttonRow.appendChild(cancelBtn);
    buttonRow.appendChild(saveBtn);
    renamePopup.appendChild(title);
    renamePopup.appendChild(input);
    renamePopup.appendChild(buttonRow);
    document.body.appendChild(renamePopup);
    
    // Focus the input for immediate typing
    input.focus();
    input.select();
  };

  // Right: Delete Page and Close buttons
  const rightButtons = document.createElement('div');
  Object.assign(rightButtons.style, {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete Page';
  Object.assign(deleteBtn.style, {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '6px 16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  });
  deleteBtn.onclick = () => {
    if (totalPages === 1) {
      alert("Can't delete the last page.");
      return;
    }
    
    if (confirm(`Delete page ${pages[pageNum]?.name || pageNum}?`)) {
      popup.remove(); // Close popup first
      // Perform deletion directly, bypassing the confirm inside deletePageByDrag
      delete pages[pageNum];
      const newPages = {};
      let index = 1;
      for (let i = 1; i <= totalPages; i++) {
        if (pages[i]) newPages[index++] = pages[i];
      }
      pages = newPages;
      totalPages = index - 1;

      // Adjust currentPage if needed
      if (pageNum === currentPage) {
        currentPage = Math.min(currentPage, totalPages);
      } else if (pageNum < currentPage) {
        currentPage = currentPage - 1;
      }

      selectedPageForDelete = null;
      updatePageLabel();
      renderPageButtons();
      loadScene(currentPage);
    }
  };

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  Object.assign(closeBtn.style, {
    background: 'gray',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '6px 16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  });
  closeBtn.onclick = () => popup.remove();

  rightButtons.appendChild(deleteBtn);
  rightButtons.appendChild(closeBtn);

  headerRow.appendChild(pageInfo);
  headerRow.appendChild(renameBtn);
  headerRow.appendChild(rightButtons);
  popup.appendChild(headerRow);

  // Tabs
  const tabRow = document.createElement('div');
  Object.assign(tabRow.style, {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    marginLeft: '20px',
    zIndex: 1,
    position: 'relative'
  });

  const tabs = ['Events', 'Tags', 'Elements', 'Procedures', 'Variables'];
  const tabContentMap = {
    'Events': 'This is the Events tab.',
    'Tags': 'This is the Tags tab.',
    'Elements': () => createElementsContent(false),
    'Procedures': 'This is the Procedures tab.',
    'Variables': 'This is the Variables tab.'
  };

  let activeTab = null;

  tabs.forEach((tab, index) => {
    const tabEl = document.createElement('div');
    tabEl.textContent = tab;

    Object.assign(tabEl.style, {
      padding: '16px 20px',
      background: index === 0 ? 'white' : '#009ecf',
      color: 'black',
      fontWeight: 'bold',
      borderRadius: '20px 20px 0 0',
      cursor: 'pointer',
      zIndex: index === 0 ? '2' : '1',
      position: 'relative'
    });

    // Handle click
    tabEl.onclick = () => {
      // Reset all tabs
      Array.from(tabRow.children).forEach(child => {
        child.style.background = '#009ecf';
        child.style.zIndex = '1';
      });
      // Activate this tab
      tabEl.style.background = 'white';
      tabEl.style.zIndex = '2';
      activeTab = tab;

      // Change content
      content.innerHTML = '';
      
      if (typeof tabContentMap[tab] === 'function') {
        content.appendChild(tabContentMap[tab]());
      } else {
        const tabContent = document.createElement('div');
        tabContent.textContent = tabContentMap[tab] || '';
        Object.assign(tabContent.style, {
          padding: '30px',
          fontSize: '18px'
        });
        content.appendChild(tabContent);
      }
    };

    // Auto-activate first tab
    if (index === 0) {
      setTimeout(() => tabEl.onclick(), 0);
    }

    tabRow.appendChild(tabEl);
  });
  
  popup.appendChild(tabRow);

  // Content Box
  const content = document.createElement('div');
  Object.assign(content.style, {
    maxHeight: '590px', // limits height
    marginTop: '-15px',
    background: 'white',
    borderRadius: '20px',
    flexGrow: '1',
    marginBottom: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 2,
    position: 'relative'
  });
  popup.appendChild(content);

  // Footer Buttons
  const footer = document.createElement('div');
  Object.assign(footer.style, {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: 'auto'
  });

  const prev = document.createElement('button');
  prev.textContent = 'Previous Page';
  const global = document.createElement('button');
  global.textContent = 'Global';
  const next = document.createElement('button');
  next.textContent = 'Next Page';

  [prev, global, next].forEach(btn => {
    Object.assign(btn.style, {
      background: '#009ecf',
      color: 'white',
      fontWeight: 'bold',
      padding: '10px 20px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer'
    });
    footer.appendChild(btn);
  });

  // Previous Page functionality
  prev.onclick = () => {
    if (pageNum > 1) {
      popup.remove();
      openPagePopup(pageNum - 1);
    }
  };

  // Next Page functionality
  next.onclick = () => {
    if (pageNum < totalPages) {
      popup.remove();
      openPagePopup(pageNum + 1);
    }
  };

  // Global functionality - open global popup
  global.onclick = () => {
    popup.remove();
    openGlobalPopup();
  };

  // Disable buttons if at boundaries
  if (pageNum === 1) {
    prev.style.opacity = '0.5';
    prev.style.cursor = 'not-allowed';
  }
  if (pageNum === totalPages) {
    next.style.opacity = '0.5';
    next.style.cursor = 'not-allowed';
  }

  popup.appendChild(footer);
  document.body.appendChild(popup);
}
function openGlobalPopup() {
  if (document.getElementById('global-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'global-popup';

  Object.assign(popup.style, {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '100vw',
    height: 'calc(100vh - 90px)',
    background: '#00cfee',
    padding: '20px',
    boxSizing: 'border-box',
    zIndex: 10000,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Segoe UI, sans-serif'
  });

  // Header Row
  const headerRow = document.createElement('div');
  Object.assign(headerRow.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  });

  // Left: Global Label
  const globalInfo = document.createElement('div');
  globalInfo.style.display = 'flex';
  globalInfo.style.alignItems = 'center';
  
  const nameLabel = document.createElement('div');
  nameLabel.style.background = '#007ea6';
  nameLabel.style.padding = '5px 12px';
  nameLabel.style.borderRadius = '12px';
  nameLabel.style.color = 'white';
  nameLabel.style.fontWeight = 'bold';
  nameLabel.textContent = 'Settings';

  globalInfo.innerHTML = `
    <div style="background:#00aee3;padding:5px 10px;border-radius:12px;color:white;margin-right:6px;font-weight:bold;">Global</div>
  `;
  globalInfo.appendChild(nameLabel);

  // Right: Close button
  const rightButtons = document.createElement('div');
  Object.assign(rightButtons.style, {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  Object.assign(closeBtn.style, {
    background: 'gray',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '6px 16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  });
  closeBtn.onclick = () => popup.remove();

  rightButtons.appendChild(closeBtn);

  headerRow.appendChild(globalInfo);
  headerRow.appendChild(rightButtons);
  popup.appendChild(headerRow);

  // Tabs
  const tabRow = document.createElement('div');
  Object.assign(tabRow.style, {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    marginLeft: '20px',
    zIndex: 1,
    position: 'relative'
  });

  const tabs = ['Events', 'Tags', 'Elements', 'Procedures', 'Variables'];
  const tabContentMap = {
    'Events': 'Global events that can be triggered from any page.',
    'Tags': 'Global tags available across all pages.',
    'Elements': () => createElementsContent(true),
    'Procedures': 'Global procedures that can be used across all pages.',
    'Variables': 'Global variables accessible from any page.'
  };

  let activeTab = null;

  tabs.forEach((tab, index) => {
    const tabEl = document.createElement('div');
    tabEl.textContent = tab;

    Object.assign(tabEl.style, {
      padding: '16px 20px',
      background: index === 0 ? 'white' : '#009ecf',
      color: 'black',
      fontWeight: 'bold',
      borderRadius: '20px 20px 0 0',
      cursor: 'pointer',
      zIndex: index === 0 ? '2' : '1',
      position: 'relative'
    });

    // Handle click
    tabEl.onclick = () => {
      // Reset all tabs
      Array.from(tabRow.children).forEach(child => {
        child.style.background = '#009ecf';
        child.style.zIndex = '1';
      });
      // Activate this tab
      tabEl.style.background = 'white';
      tabEl.style.zIndex = '2';
      activeTab = tab;

      // Change content
      content.innerHTML = '';
      
      if (typeof tabContentMap[tab] === 'function') {
        content.appendChild(tabContentMap[tab]());
      } else {
        const tabContent = document.createElement('div');
        tabContent.textContent = tabContentMap[tab] || '';
        Object.assign(tabContent.style, {
          padding: '30px',
          fontSize: '18px'
        });
        content.appendChild(tabContent);
      }
    };

    // Auto-activate first tab
    if (index === 0) {
      setTimeout(() => tabEl.onclick(), 0);
    }

    tabRow.appendChild(tabEl);
  });
  
  popup.appendChild(tabRow);

  // Content Box
  const content = document.createElement('div');
  Object.assign(content.style, {
    maxHeight: '590px', // limits height
    marginTop: '-15px',
    background: 'white',
    borderRadius: '20px',
    flexGrow: '1',
    marginBottom: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 2,
    position: 'relative'
  });
  popup.appendChild(content);

  // Footer Buttons
  const footer = document.createElement('div');
  Object.assign(footer.style, {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: 'auto'
  });

  const backToPages = document.createElement('button');
  backToPages.textContent = 'Back to Pages';

  Object.assign(backToPages.style, {
    background: '#009ecf',
    color: 'white',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer'
  });

  // Back to Pages functionality
  backToPages.onclick = () => {
    popup.remove();
    openPagePopup(currentPage);
  };

  footer.appendChild(backToPages);
  popup.appendChild(footer);
  document.body.appendChild(popup);
}
function openGlobalProcedures() {
  const existing = document.getElementById('global-popup');
  if (existing) {
    existing.remove(); // Close it if open
  } else {
    openGlobalPopup(); // Open if not present
  }
}





