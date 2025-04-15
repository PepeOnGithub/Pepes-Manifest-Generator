let dragItem = null;
let theme = localStorage.getItem('theme') || 'dark';

document.addEventListener('DOMContentLoaded', () => {
  // Set the theme when the page loads
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('theme-toggle').textContent = "Switch to Dark Mode";
  }
});

function toggleTheme() {
  // Toggle between light and dark themes
  if (theme === 'dark') {
    document.body.classList.add('light-mode');
    document.getElementById('theme-toggle').textContent = "Switch to Dark Mode";
    theme = 'light';
  } else {
    document.body.classList.remove('light-mode');
    document.getElementById('theme-toggle').textContent = "Switch to Light Mode";
    theme = 'dark';
  }
  localStorage.setItem('theme', theme);
}

function selectPack(packType) {
  // Switches to the form page and sets the pack type
  document.getElementById('packType').value = packType;
  document.getElementById('selection-container').style.display = 'none';
  document.getElementById('form-container').style.display = 'block';
  document.getElementById('form-title').textContent = packType === 'resources' ? 'Resources Pack Generator' : 'Behavior Pack Generator';
}

function goBack() {
  // Goes back to the pack selection page
  document.getElementById('selection-container').style.display = 'block';
  document.getElementById('form-container').style.display = 'none';
}

function addDependency() {
  // Adds a new dependency input field
  const container = document.createElement('div');
  container.classList.add('dependency-group');
  container.innerHTML = `
    <input type="text" placeholder="UUID" class="dependency-uuid" required>
    <input type="text" placeholder="Version (e.g., 1.0.0)" class="dependency-version" required>
    <button type="button" onclick="removeDependency(this)">Remove</button>
  `;
  document.getElementById('dependencies-container').appendChild(container);
}

function removeDependency(button) {
  // Removes the dependency group
  button.parentElement.remove();
}

function addSubpack() {
  // Adds a new subpack input field
  const container = document.createElement('div');
  container.classList.add('subpack-group');
  container.innerHTML = `
    <input type="text" placeholder="Folder Name" class="subpack-folder" required>
    <input type="text" placeholder="Name" class="subpack-name" required>
    <input type="number" placeholder="Memory Tier (e.g., 1)" class="subpack-tier" required>
    <button type="button" onclick="removeSubpack(this)">Remove</button>
  `;
  document.getElementById('subpacks-container').appendChild(container);
}

function removeSubpack(button) {
  // Removes the subpack group
  button.parentElement.remove();
}

function generateManifest() {
  // Generates the manifest.json file and triggers the download
  const packType = document.getElementById("packType").value;
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const version = document.getElementById("version").value.split('.').map(Number);
  const uuid1 = generateUUID();
  const uuid2 = generateUUID();
  const minApiVersion = document.getElementById("minimum_api_version").value.split('.').map(Number);
  const author = document.getElementById("author").value;

  const dependencies = Array.from(document.querySelectorAll('.dependency-group')).map((group) => ({
    uuid: group.querySelector('.dependency-uuid').value,
    version: group.querySelector('.dependency-version').value.split('.').map(Number)
  }));

  const subpacks = Array.from(document.querySelectorAll('.subpack-group')).map((group) => ({
    folder_name: group.querySelector('.subpack-folder').value,
    name: group.querySelector('.subpack-name').value,
    memory_tier: parseInt(group.querySelector('.subpack-tier').value)
  }));

  const manifest = {
    format_version: 2,
    header: {
      name,
      description,
      uuid: uuid1,
      version,
      min_engine_version: minApiVersion,
      author
    },
    modules: [
      {
        type: packType === 'resources' ? 'resources' : 'data',
        uuid: uuid2,
        version
      }
    ]
  };

  if (dependencies.length > 0) manifest.dependencies = dependencies;
  if (subpacks.length > 0) manifest.subpacks = subpacks;

  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "manifest.json";
  link.click();
}

function previewManifest() {
  // Previews the manifest.json in a modal before generating
  const packType = document.getElementById("packType").value;
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const version = document.getElementById("version").value.split('.').map(Number);
  const uuid1 = generateUUID();
  const uuid2 = generateUUID();
  const minApiVersion = document.getElementById("minimum_api_version").value.split('.').map(Number);
  const author = document.getElementById("author").value;

  const dependencies = Array.from(document.querySelectorAll('.dependency-group')).map((group) => ({
    uuid: group.querySelector('.dependency-uuid').value,
    version: group.querySelector('.dependency-version').value.split('.').map(Number)
  }));

  const subpacks = Array.from(document.querySelectorAll('.subpack-group')).map((group) => ({
    folder_name: group.querySelector('.subpack-folder').value,
    name: group.querySelector('.subpack-name').value,
    memory_tier: parseInt(group.querySelector('.subpack-tier').value)
  }));

  const manifest = {
    format_version: 2,
    header: {
      name,
      description,
      uuid: uuid1,
      version,
      min_engine_version: minApiVersion,
      author
    },
    modules: [
      {
        type: packType === 'resources' ? 'resources' : 'data',
        uuid: uuid2,
        version
      }
    ]
  };

  if (dependencies.length > 0) manifest.dependencies = dependencies;
  if (subpacks.length > 0) manifest.subpacks = subpacks;

  // Display the preview in a modal
  document.getElementById('preview-output').textContent = JSON.stringify(manifest, null, 2);
  document.getElementById('preview-modal').style.display = 'flex';
}

function closePreview() {
  // Closes the preview modal
  document.getElementById('preview-modal').style.display = 'none';
}

function generateUUID() {
  // Generates a random UUID
  var d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}