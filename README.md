# pkg-require

require node files relative to your package root directory

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

This is wrong for a few reasons:
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
pkg-require will do exactly this. It looks all the way up your directory tree until it finds a `package.json`, and then it will resolve all requires from that directory.

## TLDR Example

```javascript
// create an instance that will find the nearest parent dir containing package.json from your __dirname
const pkgRequire = require('pkg-require')(__dirname);

// require a file relative to the your package.json directory 
const foo = pkgRequire('foo/foo')

// or get the absolute path for a file
pkgRequire.resolve('foo/foo')
```
