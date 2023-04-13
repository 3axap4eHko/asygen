import { createPoll } from './deferredPoll.js';

export const combine = <T, R = unknown>(...iterables: AsyncIterable<T>[]) => {
  const poll = createPoll<IteratorResult<T, R>>();

  Promise.all(
    iterables.map(async (iterable) => {
      for await (const value of iterable) {
        await poll.push({ value, done: false }).promise;
      }
    })
  ).then(async () => poll.done({ value: null, done: true }));

  return {
    [Symbol.asyncIterator]() {
      return {
        next() {
          return poll.pull().promise;
        },
      };
    },
  };
};
