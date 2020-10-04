'use strict'
const { join } = require('path')
const { test } = require('tap')
const pyckle = require('..')

const fixtures = join(__dirname, 'fixtures')

const CUSTOM_PREFERENCES = {
  module: ['j', 'm', 'c'],
  commonjs: ['c', 'j', 'm'],
  undefined: ['j', 'c', 'm']
}

test('dir is required', async ({ rejects }) => {
  await rejects(pyckle(), /dir is required/)
})

test('name is required', async ({ rejects }) => {
  await rejects(pyckle(join(fixtures, 'no-match')), /name is required/)
})

test('preferences must be an object', async ({ rejects }) => {
  await rejects(pyckle(join(fixtures, 'no-match'), 'file', null), /preferences must be an object/)
  await rejects(pyckle(join(fixtures, 'no-match'), 'file', 'foo'), /preferences must be an object/)
})

test('preferences.module must be an array', async ({ rejects }) => {
  await rejects(pyckle(join(fixtures, 'no-match'), 'file', {
    module: null,
    commonjs: ['m', 'j', 'c'],
    undefined: ['m', 'j', 'c']
  }))
})

test('preferences.commonjs must be an array', async ({ rejects }) => {
  await rejects(pyckle(join(fixtures, 'no-match'), 'file', {
    module: ['m', 'j', 'c'],
    commonjs: null,
    undefined: ['m', 'j', 'c']
  }))
})

test('preferences.undefined must be an array', async ({ rejects }) => {
  await rejects(pyckle(join(fixtures, 'no-match'), 'file', {
    module: ['m', 'j', 'c'],
    commonjs: ['m', 'j', 'c'],
    undefined: null
  }))
})

test('preferences.module must have three elements', async ({ rejects }) => {
  await rejects(pyckle(join(fixtures, 'no-match'), 'file', {
    module: [],
    commonjs: ['m', 'j', 'c'],
    undefined: ['m', 'j', 'c']
  }))
})

test('preferences.commonjs must have three elements', async ({ rejects }) => {
  await rejects(pyckle(join(fixtures, 'no-match'), 'file', {
    module: ['m', 'j', 'c'],
    commonjs: [],
    undefined: ['m', 'j', 'c']
  }))
})

test('preferences.undefined must have three elements', async ({ rejects }) => {
  await rejects(pyckle(join(fixtures, 'no-match'), 'file', {
    module: ['m', 'j', 'c'],
    commonjs: ['m', 'j', 'c'],
    undefined: []
  }))
})

test('preferences elements may only be j, m or c', async ({ rejects }) => {
  await rejects(pyckle(join(fixtures, 'no-match'), 'file', {
    module: ['m', 'j', 'x'],
    commonjs: ['m', 'j', 'c'],
    undefined: ['m', 'j', 'c']
  }))
  await rejects(pyckle(join(fixtures, 'no-match'), 'file', {
    module: ['m', 'j', 'c'],
    commonjs: ['m', 'x', 'c'],
    undefined: ['m', 'j', 'c']
  }))
  await rejects(pyckle(join(fixtures, 'no-match'), 'file', {
    module: ['m', 'j', 'c'],
    commonjs: ['m', 'j', 'c'],
    undefined: ['x', 'j', 'c']
  }))
})

test('returns null if no results', async ({ is }) => {
  const result = await pyckle(join(fixtures, 'no-match'), 'file')
  is(result, null)
})

test('type-module-cjs-js', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-module-cjs-js'), 'file')
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-module-cjs-js/file.js')
})

test('type-module-cjs-mjs', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-module-cjs-mjs'), 'file')
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-module-cjs-mjs/file.mjs')
})

test('type-module-mjs-js', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-module-mjs-js'), 'file')
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-module-mjs-js/file.mjs')
})

test('type-commonjs-cjs-js', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-commonjs-cjs-js'), 'file')
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-commonjs-cjs-js/file.js')
})

test('type-commonjs-cjs-mjs', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-commonjs-cjs-mjs'), 'file')
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-commonjs-cjs-mjs/file.cjs')
})

test('type-commonjs-js-mjs', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-commonjs-js-mjs'), 'file')
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-commonjs-js-mjs/file.js')
})

test('type-undefined-cjs-js', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-undefined-cjs-js'), 'file')
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-undefined-cjs-js/file.js')
})

test('type-undefined-cjs-mjs', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-undefined-cjs-mjs'), 'file')
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-undefined-cjs-mjs/file.mjs')
})

test('type-undefined-js-mjs', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-undefined-js-mjs'), 'file')
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-undefined-js-mjs/file.mjs')
})

test('type-module-cjs-js - custom preferences', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-module-cjs-js'), 'file', CUSTOM_PREFERENCES)
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-module-cjs-js/file.js')
})

test('type-module-cjs-mjs - custom preferences', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-module-cjs-mjs'), 'file', CUSTOM_PREFERENCES)
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-module-cjs-mjs/file.mjs')
})

test('type-module-mjs-js - custom preferences', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-module-mjs-js'), 'file', CUSTOM_PREFERENCES)
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-module-mjs-js/file.js')
})

test('type-commonjs-cjs-js - custom preferences', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-commonjs-cjs-js'), 'file', CUSTOM_PREFERENCES)
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-commonjs-cjs-js/file.cjs')
})

test('type-commonjs-cjs-mjs - custom preferences', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-commonjs-cjs-mjs'), 'file', CUSTOM_PREFERENCES)
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-commonjs-cjs-mjs/file.cjs')
})

test('type-commonjs-js-mjs - custom preferences', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-commonjs-js-mjs'), 'file', CUSTOM_PREFERENCES)
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-commonjs-js-mjs/file.js')
})

test('type-undefined-cjs-js - custom preferences', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-undefined-cjs-js'), 'file', CUSTOM_PREFERENCES)
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-undefined-cjs-js/file.js')
})

test('type-undefined-cjs-mjs - custom preferences', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-undefined-cjs-mjs'), 'file', CUSTOM_PREFERENCES)
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-undefined-cjs-mjs/file.cjs')
})

test('type-undefined-js-mjs - custom preferences', async ({ is }) => {
  const { path } = await pyckle(join(fixtures, 'type-undefined-js-mjs'), 'file', CUSTOM_PREFERENCES)
  is(path, '/Users/davidclements/code/pyckle/test/fixtures/type-undefined-js-mjs/file.js')
})
