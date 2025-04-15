function selectPack(packType) {
  document.getElementById('packType').value = packType;
  document.getElementById('selection-container').style.display = 'none';
  document.getElementById('form-container').style.display = 'block';
  document.getElementById('form-title').textContent = packType === 'resources' ? 'Resources Pack Generator' : 'Behavior Pack Generator';
}

function goBack() {
  document.getElementById('selection-container').style.display = 'block';
  document.getElementById('form-container').style.display = 'none';
}

function addDependency() {
  const container = document.createElement('div');
  container.innerHTML = `
    <input type="text" placeholder="UUID" class="dependency-uuid" required>
    <input type="text" placeholder="Version (e.g., 1.0.0)" class="dependency-version" required>
  `;
  document.getElementById('dependencies-container').appendChild(container);
}

function addSubpack() {
  const container = document.createElement('div');
  container.innerHTML = `
    <input type="text" placeholder="Folder Name" class="subpack-folder" required>
    <input type="text" placeholder="Name" class="subpack-name" required>
    <input type="number" placeholder="Memory Tier (e.g., 1)" class="subpack-tier" required>
  `;
  document.getElementById('subpacks-container').appendChild(container);
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

  const dependencies = Array.from(document.getElementsByClassName('dependency-uuid')).map((_, i) => ({
    uuid: document.getElementsByClassName('dependency-uuid')[i].value,
    version: document.getElementsByClassName('dependency-version')[i].value.split('.').map(Number)
  }));

  const subpacks = Array.from(document.getElementsByClassName('subpack-folder')).map((_, i) => ({
    folder_name: document.getElementsByClassName('subpack-folder')[i].value,
    name: document.getElementsByClassName('subpack-name')[i].value,
    memory_tier: parseInt(document.getElementsByClassName('subpack-tier')[i].value)
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