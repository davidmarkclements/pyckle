# pyckle

> Picks a file from same-name filenames with different extensions based on preference around esm or cjs

Say you have a two files, one named `file.js` and one named `file.mjs` in a project. You need to choose
one of them for reasons, which one you choose depends on context and preference. Context here being,
what is the `type` field on `package.json` - if anything. Preference being, for each possible `type` 
field (`'module'`, `'commonjs'`, `undefined`) which extensions take priority over others.


## API

```js
import pyckle from 'pyckle'
```

```js
const pyckle = require('pyckle')
```

### `pyckle => async (dir, name, preferences) => Promise<Result>`

#### `dir` - Required

The directory to select files from.

#### `name` - Required

The file name, without extension.

#### `preferences` - Optional

Default:

```js
{
  module: ['m', 'j', 'c'],
  commonjs: ['j', 'c', 'm'],
  undefined: ['m', 'j', 'c']
}
```

An object with three keys specified for each `package.json` scenario - `"type":"module"`, `"type":"commonjs"` or no type. Each holds an array, with three elements, `'m'` representing the `.mjs` extension, '`j'` representing the `.js` extension, and '`c`' representing the `.cjs` extension. 

The lower the index of a character, the high the priority applied to files with the extension it represents.


### Result

Result is the same Result object as supplied by the `is-file-esm` module, see https://github.com/davidmarkclements/is-file-esm#api

## License

MIT