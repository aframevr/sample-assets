var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    gm = require('gm'),
    sizeOf = require('image-size');

var THUMBNAIL_SIZE = 155;

function log (data) {
  console.log(util.inspect(data, false, null));
}

function getValidId (name) {
  return name.split('/').pop()
          .split('.').shift()
          .replace(/\s/, '-')
          .replace(/^\d+\s*/, '')
          .replace(/[\W]/, '')
          .toLowerCase();
}

function getExtension (path) {
  return path.toLowerCase().substr(path.lastIndexOf('.') + 1);
}

function checkLicense (path, licenseId) {
  try {
    var buf = fs.readFileSync(path, "utf8");
    licenseId = licenses.push(buf) - 1;
  } catch (e) {

  }
  return licenseId;
}


var imageExtensions = [ 'jpg', 'png', 'hdr', 'gif' ];

var images = [];
var licenses = [];
var licenseExtension = 'txt';
var folderLicense = 'license.' + licenseExtension;

function processImages (fullpath, licenseId, tags, filename) {
  var stats = fs.lstatSync(fullpath),
      info = {};

  if (stats.isDirectory()) {
    licenseId = checkLicense(fullpath + '/' + folderLicense, licenseId);

    info.name = path.basename(fullpath);
    info.isFolder = true;
    var children = fs.readdirSync(fullpath);
    if (fullpath !== 'images') { tags.push(info.name); }
    info.children = children
      .filter(function(child) {
        if (fs.lstatSync(fullpath + '/' + child).isDirectory() || imageExtensions.indexOf(getExtension(child)) !== -1) {
          return true;
        }
        return false;
      })
      .map(function(child) {
        return processImages(fullpath + '/' + child, licenseId, tags, child);
      });
    if (fullpath !== 'images') { tags.pop(); }
  } else {
    var licenseFile = fullpath.substr(0, fullpath.lastIndexOf('.')) + '.' + licenseExtension;
    licenseId = checkLicense(licenseFile, licenseId);

    info.licenseId = licenseId;
    info.id = getValidId(fullpath);
    info.path = fullpath.replace('assets/images/', '');
    info.tags = tags.slice(0);
    info.thumbnail = fullpath.replace('assets/images/', '').replace(/\//g, '');

    // Generate thumbnail
    gm(fullpath)
    .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE)
    .noProfile()
    .write('assets/thumbs/images/' + info.thumbnail, function(err) {
      if (err) {
        console.log(err);
      }
    });

    // Get image size synchronously
    try {
      var dimensions = sizeOf(fullpath);
      info.width = dimensions.width;
      info.height = dimensions.height;
    } catch (e) {
      info.width = 0;
      info.heght = 0;
    }

    images.push(info);
  }

  return info;
}

processImages('assets/images', -1, []);

var data = {
  licenses: licenses,
  basepath: {
    images: 'assets/images/',
    images_thumbnails: 'assets/thumbs/images/'
  },
  images: images
};

var outputDir = 'dist';
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
