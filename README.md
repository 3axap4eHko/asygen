# Asygen

0-Deps, simple and fast async generator library for browser and NodeJS.

Supports ESM and CommonJS modules.

[![Build Status][github-image]][github-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Coverage Status][codecov-image]][codecov-url]
[![Maintainability][codeclimate-image]][codeclimate-url]

## Usage

```typescript
import { defer, generatorify } from 'asygen';

const result = defer();

console.log(result.status); // pending

task.once('data', error.resolve);
task.once('error', error.reject);
await result.promise;

console.log(result.status); // resolved or rejected

// easy way to turn your events into asyncGenerator
for await (const data of generatorify(send => process.on('data', send))) {
  // handle data
}
```

## License

License [Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)
Copyright (c) 2023-present Ivan Zakharchanka


[npm-url]: https://www.npmjs.com/package/asygen
[downloads-image]: https://img.shields.io/npm/dw/asygen.svg?maxAge=43200
[npm-image]: https://img.shields.io/npm/v/asygen.svg?maxAge=43200
[github-url]: https://github.com/3axap4eHko/asygen/actions/workflows/cicd.yml
[github-image]: https://github.com/3axap4eHko/asygen/actions/workflows/cicd.yml/badge.svg
[codecov-url]: https://codecov.io/gh/3axap4eHko/asygen
[codecov-image]: https://codecov.io/gh/3axap4eHko/asygen/branch/master/graph/badge.svg?token=JZ8QCGH6PI
[codeclimate-url]: https://codeclimate.com/github/3axap4eHko/asygen/maintainability
[codeclimate-image]: https://api.codeclimate.com/v1/badges/0ba20f27f6db2b0fec8c/maintainability
[snyk-url]: https://snyk.io/test/npm/asygen/latest
[snyk-image]: https://img.shields.io/snyk/vulnerabilities/github/3axap4eHko/asygen.svg?maxAge=43200
