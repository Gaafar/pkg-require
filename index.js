var path = require('path');
var fs = require('fs');

// TODO: memoize with limit?
function findPackageDir(dir) {
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

  function root() {
    return packageDir;
  }

  function requireInPkg(relativePath) {
    return require(resolve(relativePath));
  }

  requireInPkg.resolve = resolve;
  requireInPkg.root = root;

  return requireInPkg;
}

function createInstance(currentDirectory) {
  if (
    !currentDirectory
    || typeof currentDirectory !== 'string'
    || !path.isAbsolute(currentDirectory)
    ) {
    throw new Error('module must be called with an absolute path as argument, '
    + "eg: require('pkg-require')(__dirname), "
    + 'instead received: '
    + currentDirectory
    );
  }

  var packageDir = findPackageDir(currentDirectory);
  return pkgRequireFactory(packageDir);
}

module.exports = createInstance;
