[![Build Status](https://travis-ci.org/Gaafar/pkg-require.svg?branch=master)](https://travis-ci.org/Gaafar/pkg-require)
[![Coverage Status](https://coveralls.io/repos/github/Gaafar/pkg-require/badge.svg?branch=master)](https://coveralls.io/github/Gaafar/pkg-require?branch=master)
[![npm](https://img.shields.io/npm/v/pkg-require.svg?maxAge=2592000)](https://www.npmjs.com/package/pkg-require)
[![Dependency Status](https://david-dm.org/Gaafar/pkg-require.svg)](https://david-dm.org/Gaafar/pkg-require)

# pkg-require

require node files relative to your package root directory

`npm i -S pkg-require`

## How we got here

Imagine this directory tree

```
root
├── foo
│   └── foo.js
├── package.json
└── some
    └── deep
        └── dir
            └── tree
                └── bar.js
```

Now if you're in `bar.js` and want to require `foo.js` you need to go all the way up to the root dir and then specify the file you want.


```javascript
const foo = require('../../../../foo/foo');
```

This is annoying for a few reasons:
* hard to read
* hard to write
* needs to be maintained if you move `bar.js` around
* needs to be maintained if you move `foo.js` around, which cannot be done with a simple search and replace as you may have different numbers of `'../'` in different files requiring `foo.js`

Wouldn't it be simpler if you can just write

```javascript
const foo = require('foo/foo');
```

and it would just understand that you mean to require a module relative to your root directory? What do you mean by root directory? The one that contains `package.json`.

# pkg-require
`pkg-require` will do exactly this. It looks all the way up your directory tree until it finds the first `package.json`, and then it will resolve all `require`s from that directory.

## TLDR Example

```javascript
// create an instance that will find the nearest parent dir containing package.json from your __dirname
const pkgRequire = require('pkg-require')(__dirname);

// require a file relative to the your package.json directory 
const foo = pkgRequire('foo/foo')

// get the absolute path for a file
const absolutePathToFoo = pkgRequire.resolve('foo/foo')

// get the absolute path to your root directory
const packageRootPath = pkgRequire.root()

```
now you can go write useful code instead of counting how many levels you need to go up to require a file.

## API

### `require`
create a new instance for the package based on current file directory
```javascript
const pkgRequire = require('pkg-require')(__dirname);
```

### `pkgRequire()`
require a file by passing its path relative to the directory containing `package.json`
```javascript
const foo = pkgRequire('foo/foo')
```

### `pkgRequire.resolve()`
resolve a file/dir absolute path by passing its path relative to the directory containing `package.json`
```javascript
const absolutePathToFoo = pkgRequire.resolve('foo/foo')
```

### `pkgRequire.root()`
return the absolute path to the parent directory containing `package.json`
```javascript
const packageRootPath = pkgRequire.root()
```

## Other Solutions/Hacks
There are a bunch of ways people have been dealing with this problem, which include
* creating a sym link in `node_modules` to your project dir
* modifying `$NODE_PATH`
* calling `require.main.require`
* using a global variable for base directory
* overriding/mutating the global `require`

these solutions are not just hacky and almost impossible to track, most of these solutions will wreak havoc if you use them in package installed with npm, or if you have a few of packages installed doing these hacks.

`pkg-require` does not involve any such hacks, it's a pure function with no side effects or mutations. It takes `__dirname` as an input, finds the first parent directory containing `package.json`, and uses that directory to resolve all files. This way it can work for nested modules and multiple modules because each module will pass its own `__dirname` and get a different instance of the module.
