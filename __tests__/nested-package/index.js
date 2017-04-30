const path = require('path');

test('require from nested package', () => {
  const pkgRequire = require('../../')(__dirname);

  const packageRoot = pkgRequire.root();
  expect(path.isAbsolute(packageRoot)).toBe(true);
  expect(packageRoot).toMatch(/\/pkg-require\/__tests__\/nested-package$/);
  expect(pkgRequire('bar/bar')).toBe('bar');
});
