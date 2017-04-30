const path = require('path');

test('require from root package', () => {
  const pkgRequire = require('../')(__dirname);

  const packageRoot = pkgRequire.root();
  expect(path.isAbsolute(packageRoot)).toBe(true);
  expect(packageRoot).toMatch(/\/pkg-require$/);
  expect(pkgRequire('__tests__/foo/foo')).toBe('foo');
});

test('throw error if no package found', () => {
  expect(() => {
    require('../')('/');
  }).toThrow('package directory not found');
});

test('throw error if no absolute path provided to module', () => {
  const errorMsg = 'module must be called with an absolute path as argument, '
  + "eg: require('pkg-require')(__dirname)";

  const testCases = [
    undefined,
    null,
    '',
    './',
    '..',
    'dir',
    'dir/dir2',
  ];

  testCases.forEach((testCase) => {
    expect(() => {
      require('../')(testCase);
    }).toThrow(errorMsg);
  });
});
