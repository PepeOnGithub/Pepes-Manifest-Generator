function generateManifest() {
  var name = document.getElementById("name").value;
  var description = document.getElementById("description").value;
  var version = document.getElementById("version").value;
  var uuid = generateUUID();
  var uuid2 = generateUUID2();
  var minimum_api_version = document.getElementById("minimum_api_version").value;
  var author = document.getElementById("author").value;

  var manifest = {
    "format_version": 2,
    "header": {
      "name": name,
      "description": description,
      "uuid": uuid,
      "version": [parseInt(version.split(".")[0]), parseInt(version.split(".")[1]), parseInt(version.split(".")[2])],
      "min_engine_version": [parseInt(minimum_api_version.split(".")[0]), parseInt(minimum_api_version.split(".")[1]), parseInt(minimum_api_version.split(".")[2])],
      "author": author
    },
    "modules": [
      {
        "type": "resources",
        "uuid": uuid2,
        "version": [parseInt(version.split(".")[0]), parseInt(version.split(".")[1]), parseInt(version.split(".")[2])]
      }
    ]
  };

  var manifestJson = JSON.stringify(manifest, null, 2);

  var blob = new Blob([manifestJson], { type: "application/json" });
  var url = URL.createObjectURL(blob);

  var link = document.createElement("a");
  link.href = url;
  link.download = "manifest.json";
  link.click();
}

function generateUUID() {
  var d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); 
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function generateUUID2() {
  var d = new Date().getTime();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); 
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
