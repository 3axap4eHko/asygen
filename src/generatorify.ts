import { createQueue } from './queue.js';

export interface TaskCallback<T> {
  (value: T): Promise<void>;
}

export interface Task<T, R = unknown> {
  (callback: TaskCallback<T>): R;
}

export const generatorify = <T, R>(task: Task<T, R>): AsyncIterable<T> => {
  const queue = createQueue<IteratorResult<T, R>>();

  Promise.resolve(
    task(async (value) => {
      await queue.push({ value, done: false }).promise;
    }),
  ).then(async (value) => queue.done({ value, done: true }));

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
