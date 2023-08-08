import { createQueue } from './queue.js';

export const combine = <T, R = unknown>(...iterables: AsyncIterable<T>[]) => {
  const queue = createQueue<IteratorResult<T, R>>();

  Promise.all(
    iterables.map(async (iterable) => {
      for await (const value of iterable) {
        await queue.push({ value, done: false }).promise;
      }
    })
  ).then(async () => queue.done({ value: null, done: true }));

  return {
    [Symbol.asyncIterator]() {
      return {
        next() {
          return queue.pull().promise;
        },
      };
    },
  };
};
