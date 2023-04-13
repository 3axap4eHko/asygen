import { strict as assert } from 'node:assert';
import { defer, Deferred, generatorify, createPoll, combine } from '../../build/index.js';

assert(typeof defer === 'function');
assert(typeof Deferred === 'function');
assert(typeof generatorify === 'function');
assert(typeof createPoll === 'function');
assert(typeof combine === 'function');

console.log('MJS import test passed');
