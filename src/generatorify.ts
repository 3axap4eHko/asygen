import { defer, Deferred } from './defer';

export interface TaskCallback<T> {
  (value: T): Promise<T>;
}

export interface Task<T, R = unknown> {
  (callback: TaskCallback<T>): R;
}

export const generatorify = <T, R = unknown>(task: Task<T, R>): AsyncIterable<T> => {
  const dPoll: Deferred<IteratorResult<T, R>>[] = [defer<IteratorYieldResult<T>>()];

  Promise.resolve(task(value => {
    const next = defer<IteratorYieldResult<T>>();
    const prev = dPoll.push(next) - 2;
    const prevDeferred = dPoll[prev] as Deferred<IteratorYieldResult<T>>;
    prevDeferred.resolve({ value, done: false });
    return prevDeferred.promise.then(v => v.value);
  })).then(async (value) => {
    dPoll[dPoll.length - 1].resolve({ value, done: true });
    await Promise.all(dPoll.map(d => d.promise));
    return { value, done: true };
  });

  return {
    [Symbol.asyncIterator]() {
      return {
        next() {
          const current = dPoll[0];
          current.promise.then(() => dPoll.shift());
          return current.promise;
        },
      };
    }
  };
}
