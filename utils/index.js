var fs = require('fs'),
    path = require('path'),
    util = require('util')

function getValidId (name) {
  // info.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '')
  return name.split('/').pop()
          .split('.').shift()
          .replace(/\s/, '-')
          .replace(/^\d+\s*/, '')
          .replace(/[\W]/, '')
          .toLowerCase();
}

function getExtension(filename) {
  return filename.toLowerCase().substr(filename.lastIndexOf('.') + 1);
}

var imageExtensions = [ 'jpg', 'png', 'hdr', 'gif' ];

var images = [];
var licenses = [];
var licenseExtension = 'txt';
var folderLicense = 'license.' + licenseExtension;

function checkLicense(filename, licenseId) {
  try {
    var buf = fs.readFileSync(filename, "utf8");
    licenseId = licenses.push(buf) - 1;
  } catch (e) {

  }
  return licenseId;
}

var images = [];

function dirTree(filename, licenseId, tags) {
  var stats = fs.lstatSync(filename),
      info = {};

  if (stats.isDirectory()) {
    licenseId = checkLicense(filename + '/' + folderLicense, licenseId);

    info.name = path.basename(filename);
    info.isFolder = true;
    var children = fs.readdirSync(filename);
    if (filename !== 'images') { tags.push(info.name); }
    info.children = children
      .filter(function(child) {
        if (fs.lstatSync(filename + '/' + child).isDirectory() || imageExtensions.indexOf(getExtension(child)) !== -1) {
          return true;
        }
        return false;
      })
      .map(function(child) {
        return dirTree(filename + '/' + child, licenseId, tags);
      });
    if (filename !== 'images') { tags.pop(); }
  } else {
    var licenseFile = filename.substr(0, filename.lastIndexOf('.')) + '.' + licenseExtension;
    licenseId = checkLicense(licenseFile, licenseId);

    info.licenseId = licenseId;
    info.id = getValidId(filename);
    info.path = filename;
    info.tags = tags.slice(0);

    images.push(info);
  }

  return info;
}

var result = [];
function flattern(children, parent, tags) {
  for (var i=0;i< children.length; i++) {
    var child = children[i];
    if (child.isFolder) {
      //tags.push(child.name);
      flattern(child.children, parent, tags);
    }
    result.push({
      id:  child.id,
      path: child.path,
      license: child.license,
      tag: tags
    });
  }
}
function log(data) {
  console.log(util.inspect(data, false, null));
}

var data = dirTree('images', -1, []);

var data = {
  licenses: licenses,
  images: images
};

var outputDir = 'build';
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

fs.writeFile(outputDir + '/images.json', JSON.stringify(data), function(err) {
  if(err) {
    console.log(err);
  } else {
    console.log("JSON saved");
  }
});
