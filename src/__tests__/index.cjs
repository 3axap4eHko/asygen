const { strict: assert } = require('node:assert')
const { defer, Deferred, generatorify } = require('../../build/index.cjs');

assert(typeof defer === 'function');
assert(typeof Deferred === 'function');
assert(typeof generatorify === 'function');

console.log('CJS import test passed');
