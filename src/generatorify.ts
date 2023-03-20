import { defer } from './defer';

interface GeneratorState<T> {
  value: T;
  done: boolean
}

interface TaskCallback<T> {
  (value: T): Promise<T>;
}

export interface Task<T, R = unknown> {
  (callback: TaskCallback<T>): R;
}

export const generatorify = <T, R = unknown>(task: Task<T, R>): AsyncIterable<T> => {
  const dPoll = [defer<GeneratorState<T>>()];

  Promise.resolve(task(value => {
    const next = defer<GeneratorState<T>>();
    const prev = dPoll.push(next) - 2;
    dPoll[prev].resolve({ value, done: false });
    return dPoll[prev].promise.then(v => v.value);
  })).then(async (value) => {
    await Promise.all(dPoll.map(d => d.promise));
    return { value, done: true };
  });

  return {
    [Symbol.asyncIterator]() {
      return {
        next() {
          const current = dPoll[0];
          current?.promise?.then(() => dPoll.shift());
          return current?.promise;
        },
      };
    }
  };
}
