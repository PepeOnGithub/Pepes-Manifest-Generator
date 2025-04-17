let theme = localStorage.getItem('theme') || 'dark';

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const themeToggle = document.getElementById('theme-toggle');
  const selectionGrid = document.getElementById('selection-grid');
  const formContainer = document.getElementById('form-container');
  const backBtn = document.getElementById('back-btn');
  const formTitle = document.getElementById('form-title');
  const packTypeInput = document.getElementById('packType');
  const previewBtn = document.getElementById('preview-btn');
  const generateBtn = document.getElementById('generate-btn');
  const previewModal = document.getElementById('preview-modal');
  const modalClose = document.getElementById('modal-close');
  const previewContent = document.getElementById('preview-content');
  const dependenciesContainer = document.getElementById('dependencies-container');
  const subpacksContainer = document.getElementById('subpacks-container');

  // Initialize theme
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
  }

  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);

  // Pack selection
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', function() {
      const packType = this.getAttribute('data-pack');
      selectPack(packType);
    });
  });

  // Back button
  backBtn.addEventListener('click', goBack);

  // Preview button
  previewBtn.addEventListener('click', previewManifest);

  // Generate button
  generateBtn.addEventListener('click', generateManifest);

  // Modal close
  modalClose.addEventListener('click', closePreview);

  // Functions
  function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    
    theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
  }

  function selectPack(packType) {
    selectionGrid.classList.add('hidden');
    formContainer.classList.remove('hidden');
    packTypeInput.value = packType;
    
    if (packType === 'behavior') {
      formTitle.textContent = 'Behavior Pack Generator';
    } else {
      formTitle.textContent = 'Resource Pack Generator';
    }
  }

  function goBack() {
    formContainer.classList.add('hidden');
    selectionGrid.classList.remove('hidden');
  }
});

function addDependency() {
  const container = document.createElement('div');
  container.className = 'dependency-group';
  container.innerHTML = `
    <div class="input-group">
      <input type="text" placeholder="UUID" class="dependency-uuid form-input" required>
    </div>
    <div class="input-group">
      <input type="text" placeholder="Version" class="dependency-version form-input" required>
    </div>
    <button type="button" class="remove-btn" onclick="removeDependency(this)">
      <i class="fas fa-times"></i>
    </button>
  `;
  document.getElementById('dependencies-container').appendChild(container);
}

function removeDependency(button) {
  button.parentElement.remove();
}

function addSubpack() {
  const container = document.createElement('div');
  container.className = 'subpack-group';
  container.innerHTML = `
    <div class="input-group">
      <input type="text" placeholder="Folder Name" class="subpack-folder form-input" required>
    </div>
    <div class="input-group">
      <input type="text" placeholder="Name" class="subpack-name form-input" required>
    </div>
    <div class="input-group">
      <input type="number" placeholder="Memory Tier" class="subpack-tier form-input" required>
    </div>
    <button type="button" class="remove-btn" onclick="removeSubpack(this)">
      <i class="fas fa-times"></i>
    </button>
  `;
  document.getElementById('subpacks-container').appendChild(container);
}

function removeSubpack(button) {
  button.parentElement.remove();
}

function previewManifest() {
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

  document.getElementById('preview-content').textContent = JSON.stringify(manifest, null, 2);
  document.getElementById('preview-modal').classList.remove('hidden');
}

function closePreview() {
  document.getElementById('preview-modal').classList.add('hidden');
}

function generateManifest() {
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
  const a = document.createElement('a');
  a.href = url;
  a.download = 'manifest.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateUUID() {
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
