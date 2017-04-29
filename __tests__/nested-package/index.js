test('require from nested package', () => {
  var pkgRequire = require('../../')(__dirname);

  expect(pkgRequire('bar/bar')).toBe('bar');
});
