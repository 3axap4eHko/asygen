const { strict: assert } = require('node:assert')
const { defer, Deferred, generatorify, createPoll, combine } = require('../../build/index.cjs');

assert(typeof defer === 'function');
assert(typeof Deferred === 'function');
assert(typeof generatorify === 'function');
assert(typeof createPoll === 'function');
assert(typeof combine === 'function');

console.log('CJS import test passed');
