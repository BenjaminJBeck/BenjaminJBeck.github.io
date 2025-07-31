function addImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = 'image/*';
  input.style.display = 'none';
  input.onchange = function () {
    const files = input.files;
    if (!files.length) return;
    
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        
        // Add metadata
        img.dataset.filename = file.name;
        img.dataset.filepath = file.webkitRelativePath || file.name;
        img.dataset.dataurl = e.target.result;
        img.dataset.name = ''; // Default empty name
        
        img.classList.add('selectable');
        img.style.position = 'absolute';
        img.style.top = '10%';
        img.style.left = '10%';
        img.style.width = '10%';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.draggable = false;
        img.style.cursor = 'default';
        
        img.onclick = function (ev) {
          if (inPreviewMode) return;
          isClickOnOpaquePixel(img, ev, () => {
            ev.stopPropagation();
            document.querySelectorAll('.selectable').forEach(el => el.classList.remove('selected'));
            img.classList.add('selected');
            selectedElement = img;
          });
        };
        
        document.getElementById('actual-canvas').appendChild(img);
        
        // Initialize pages[currentPage] if it doesn't exist
        if (!pages[currentPage]) {
          pages[currentPage] = [];
          pages[currentPage].elements = [];
        }
        
        // Initialize elements array for this page if it doesn't exist
        if (!pages[currentPage].elements) {
          pages[currentPage].elements = [];
        }
        
        // Create image data object
        const imageData = {
          type: 'image',
          filename: file.name,
          element: img,
          pageNum: currentPage,
          id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };
        
        // Add to current page's elements array
        pages[currentPage].elements.push(imageData);
        pages[currentPage].push(img);
        
        // Add to global images array (THIS IS THE KEY CHANGE)
        globalImages.push(imageData);
      };
      reader.readAsDataURL(file);
    }
  };
  
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}
function openNamePopupForImage(img) {
  const existing = document.getElementById("name-popup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "name-popup";
  Object.assign(popup.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "linear-gradient(to bottom, #00bfe7, #00a6cc)",
    borderRadius: "20px",
    padding: "30px",
    width: "320px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    fontFamily: "Segoe UI, sans-serif",
    zIndex: 10002,
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  });

  const title = document.createElement("h3");
  title.textContent = "Set Image Name";
  title.style.margin = "0";
  title.style.fontSize = "18px";
  title.style.color = "white";
  popup.appendChild(title);

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter image name";
  input.value = img.dataset.name || "";
  input.style.padding = "8px 10px";
  input.style.borderRadius = "8px";
  input.style.border = "1px solid #ccc";
  popup.appendChild(input);

  // Focus immediately when popup appears
  setTimeout(() => input.focus(), 0);

  const checkboxRow = document.createElement("div");
  checkboxRow.style.display = "flex";
  checkboxRow.style.alignItems = "center";
  checkboxRow.style.justifyContent = "space-between";

  const checkboxLabel = document.createElement("label");
  checkboxLabel.style.display = "flex";
  checkboxLabel.style.alignItems = "center";
  checkboxLabel.style.gap = "8px";
  checkboxLabel.style.fontSize = "14px";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = img.dataset.inventory === "true";

  const labelText = document.createElement("span");
  labelText.textContent = "Store in inventory";

  checkboxLabel.appendChild(checkbox);
  checkboxLabel.appendChild(labelText);
  checkboxRow.appendChild(checkboxLabel);

  const moreBtn = document.createElement("button");
  moreBtn.textContent = "More Options";
  Object.assign(moreBtn.style, {
    fontSize: "12px",
    padding: "6px 12px",
    borderRadius: "10px",
    border: "none",
    background: "#eeeeee",
    color: "#333",
    cursor: "pointer",
    fontWeight: "bold"
  });
  moreBtn.onclick = () => alert("More Options (not implemented yet)");

  checkboxRow.appendChild(moreBtn);
  popup.appendChild(checkboxRow);

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  Object.assign(saveBtn.style, {
    padding: "10px",
    background: "#007ea6",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer"
  });

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Cancel";
  Object.assign(closeBtn.style, {
    padding: "10px",
    background: "#ccc",
    color: "black",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer"
  });

  closeBtn.onclick = () => popup.remove();

  const handleSave = () => {
    const name = input.value.trim();
    const inventory = checkbox.checked;

    img.dataset.name = name;
    img.dataset.inventory = inventory;

    // Update the image data in globalImages array
    const globalImageIndex = globalImages.findIndex(imgData => imgData.element === img);
    if (globalImageIndex > -1) {
      globalImages[globalImageIndex].name = name;
    }

    if (!pages[currentPage].meta) pages[currentPage].meta = {};
    if (!pages[currentPage].meta.namedImages) pages[currentPage].meta.namedImages = [];

    pages[currentPage].meta.namedImages = pages[currentPage].meta.namedImages.filter(obj => obj.element !== img);

    if (name) {
      pages[currentPage].meta.namedImages.push({
        name,
        element: img,
        inventory
      });
    }

    popup.remove();
    
    // Refresh both page and global popups if they're open
    const pagePopup = document.getElementById('page-popup');
    const globalPopup = document.getElementById('global-popup');
    
    if (pagePopup) {
      const activeTab = pagePopup.querySelector('[style*="background: white"]');
      if (activeTab && activeTab.textContent === 'Elements') {
        activeTab.onclick();
      }
    }
    
    if (globalPopup) {
      const activeTab = globalPopup.querySelector('[style*="background: white"]');
      if (activeTab && activeTab.textContent === 'Elements') {
        activeTab.onclick();
      }
    }
  };

  saveBtn.onclick = handleSave;

  // Pressing Enter saves the popup
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  });

  const btnRow = document.createElement("div");
  btnRow.style.display = "flex";
  btnRow.style.justifyContent = "space-between";
  btnRow.appendChild(closeBtn);
  btnRow.appendChild(saveBtn);
  popup.appendChild(btnRow);

  document.body.appendChild(popup);
}