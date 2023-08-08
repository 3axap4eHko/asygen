# Asygen

0-Deps, simple and fast async generator library for browser and NodeJS.

Supports ESM and CommonJS modules.

[![Build Status][github-image]][github-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Coverage Status][codecov-image]][codecov-url]
[![Maintainability][codeclimate-image]][codeclimate-url]

## Installation

Npm installation

```bash
npm install asygen
```

Yarn installation

```bash
yarn add asygen
```

## Utilities

#### Deferred

- Represents a deferred operation.
- Provides methods resolve and reject to control the wrapped promise.
- Exposes properties promise and status to get the underlying promise and its current status.

#### Queue

- A queue system for handling asynchronous tasks.
- Offers methods `push`, `pull`, and `done` to manage tasks.

#### Generatorify

- Convert a task into an asynchronous iterable.
- The iterable can be used in `for await...of` loops to process values as they're produced.

#### Combine

- Combine multiple asynchronous iterables into a single iterable.
- The resulting iterable will yield values from all input iterables and complete when all of them are done.

## Usage

#### Create deferred operation

```typescript
import { defer, Status } from 'asygen';

const deferred = defer<number>();
console.log(deferred.status); // Status.PENDING

deferred.resolve(42);
deferred.promise.then((value) => {
  console.log(value); // 42
  console.log(deferred.status); // Status.RESOLVED
});
```

#### Create a deferred operation from events

```typescript
import { defer } from 'asygen';

const result = defer();

console.log(result.status); // pending

task.once('data', error.resolve);
task.once('error', error.reject);
await result.promise;

console.log(result.status); // resolved or rejected
```

#### Task queue

```typescript
import { createQueue } from 'asygen';

const queue = createQueue<number>();

queue.push(1);
queue.push(2);
queue.push(3);

queue.pull().promise.then((value) => console.log(value)); // 1
queue.pull().promise.then((value) => console.log(value)); // 2
```

#### Generatorify

```typescript
import { generatorify } from 'asygen';

const task = async (callback) => {
  await callback('Hello');
  await callback('World');
  return 'Done!';
};

const iterable = generatorify(task);

(async () => {
  for await (const value of iterable) {
    console.log(value); // "Hello", then "World"
  }
})();
```

#### Convert events to asyncGenerator

```typescript
import { once } from 'node:events';
import { generatorify, Task } from 'asygen';

// send data from the event until process exit
const task: Task = async (send) => {
  process.on('data', send);
  await once(process, 'exit');
};

for await (const data of generatorify(task)) {
  // handle data
}
```

#### Combine tasks

```typescript
import { generatorify, combine } from 'asygen';

const task1 = async (callback) => {
  await callback('Task1 - Hello');
  await callback('Task1 - World');
};

const task2 = async (callback) => {
  await callback('Task2 - Foo');
  await callback('Task2 - Bar');
};

const iterable1 = generatorify(task1);
const iterable2 = generatorify(task2);

const combined = combine(iterable1, iterable2);

(async () => {
  for await (const value of combined) {
    console.log(value); // Logs values from both task1 and task2
  }
})();
```

#### Combine generators

```typescript
import { combine } from 'asygen';

const sleep = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

async function* generate(timeout: number, count: number) {
  for (let index = 0; index < count; index++) {
    yield index;
    await sleep(timeout);
  }
}

for await (const data of combine(generate(100, 5), generate(500, 2))) {
  // handle data
}
// First:    0 1 2 3 4 -
// Second:   0 . . . . 1
// Combined: 0 0 1 2 3 4 1
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
[codecov-image]: https://codecov.io/gh/3axap4eHko/asygen/branch/master/graph/badge.svg?token=ZKYSDY7GQ0
[codeclimate-url]: https://codeclimate.com/github/3axap4eHko/asygen/maintainability
[codeclimate-image]: https://api.codeclimate.com/v1/badges/0f24a357154bada2a37f/maintainability
[snyk-url]: https://snyk.io/test/npm/asygen/latest
[snyk-image]: https://img.shields.io/snyk/vulnerabilities/github/3axap4eHko/asygen.svg?maxAge=43200
