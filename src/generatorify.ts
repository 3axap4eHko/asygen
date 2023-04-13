import { createPoll } from './deferredPoll.js';

export interface TaskCallback<T> {
  (value: T): Promise<void>;
}

export interface Task<T, R = unknown> {
  (callback: TaskCallback<T>): R;
}

export const generatorify = <T, R>(task: Task<T, R>): AsyncIterable<T> => {
  const poll = createPoll<IteratorResult<T, R>>();

  Promise.resolve(
    task(async (value) => {
      await poll.push({ value, done: false }).promise;
    })
  ).then(async (value) => poll.done({ value, done: true }));

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
