var path = require('path');
var fs = require('fs');

// TODO: memoize with limit?
function findPackageDir(dir) {
  if (!dir || typeof dir !== 'string') {
    throw new Error('missing directory argument');
  }

  var dirContainsPackage = fs.existsSync(path.join(dir, 'package.json'));

  if (dirContainsPackage) {
    return dir;
  }

  var parentDir = path.resolve(dir, '..');

  // if root directory is reached without finding package file
  if (parentDir === dir) {
    throw new Error('package directory not found');
  }

  // recursively look for package in parent dir
  return findPackageDir(parentDir);
}

function pkgRequireFactory(packageDir) {
  function resolve(relativePath) {
    return path.join(packageDir, relativePath);
  }

  function requireInPkg(relativePath) {
    return require(resolve(relativePath));
  }

  requireInPkg.resolve = resolve;

  return requireInPkg;
}

function createInstance(modulePath) {
  var packageDir = findPackageDir(modulePath);
  return pkgRequireFactory(packageDir);
}

module.exports = createInstance;
