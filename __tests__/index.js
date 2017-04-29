test('require from root package', () => {
  const pkgRequire = require('../')(__dirname);

  expect(pkgRequire('__tests__/foo/foo')).toBe('foo');
});

test('throw error if no path provided', () => {
  expect(() => {
    require('../')('');
  }).toThrowError('missing directory argument');

  expect(() => {
    require('../')();
  }).toThrowError('missing directory argument');
});

test('throw error if no package found', () => {
  expect(() => {
    require('../')('/');
  }).toThrow('package directory not found');
});
