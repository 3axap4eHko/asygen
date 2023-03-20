import { strict as assert } from 'node:assert';
import { defer, Deferred, generatorify } from '../../build/index.js';

assert(typeof defer === 'function');
assert(typeof Deferred === 'function');
assert(typeof generatorify === 'function');

console.log('MJS import test passed');
