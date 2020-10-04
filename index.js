'use strict'
const { promisify } = require('util')
const glob = promisify(require('glob'))
const isFileEsm = require('is-file-esm')
const assert = require('assert').strict

const DEFAULT_PREFERENCES = {
  module: ['m', 'j', 'c'],
  commonjs: ['j', 'c', 'm'],
  undefined: ['m', 'j', 'c']
}

async function pyckle (dir, name, preferences = DEFAULT_PREFERENCES) {
  assert(dir, 'dir is required')
  assert(name, 'name is required')
  assert(preferences, 'preferences must be an object')
  assert.equal(typeof preferences, 'object', 'preferences must be an object')
  assert(Array.isArray(preferences.module), 'preferences.module must be an array')
  assert(Array.isArray(preferences.commonjs), 'preferences.commonjs must be an array')
  assert(Array.isArray(preferences.undefined), 'preferences.undefined must be an array')
  assert.equal(preferences.module.length, 3, 'preferences.module must have three elements')
  assert.equal(preferences.commonjs.length, 3, 'preferences.commonjs must have three elements')
  assert.equal(preferences.undefined.length, 3, 'preferences.undefined must have three elements')
  assert(preferences.module.every((el) => /m|j|c/.test(el)), 'preferences elements may only be j, m or c')
  assert(preferences.commonjs.every((el) => /m|j|c/.test(el)), 'preferences elements may only be j, m or c')
  assert(preferences.undefined.every((el) => /m|j|c/.test(el)), 'preferences elements may only be j, m or c')
  const files = await glob(`${name}.*(m|c)js`, {
    cwd: dir,
    absolute: true
  })
  const results = await Promise.all(files.map((file) => isFileEsm(file)))
  if (results.length === 0) return null
  const { type } = results[0] // type is same on all results
  const p = preferences[type]
  const sorted = results.sort((a, b) => p.indexOf(a.extType) - p.indexOf(b.extType))
  const preferred = sorted[0]
  return preferred
}

module.exports = pyckle
