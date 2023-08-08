import { defer, Deferred, Status } from './defer.js';

export const createQueue = <T, E = Error>() => {
  const pendingQueue: Deferred<T, E>[] = [];
  const resolvedQueue: Deferred<T, E>[] = [];
  const requestQueue: Deferred<T, E>[] = [];

  const push = (value: T): Deferred<T, E> => {
    const task = defer<T, E>();
    pendingQueue.push(task);

    Promise.resolve(value)
      .then(task.resolve)
      .catch(task.reject)
      .finally(() => {
        pendingQueue.splice(pendingQueue.indexOf(task), 1);
        if (requestQueue.length > 0) {
          const request = requestQueue.shift();
          request.resolve(task.promise);
        } else {
          resolvedQueue.push(task);
        }
      });

    return task;
  };

  const pull = (): Deferred<T, E> => {
    if (resolvedQueue.length > 0) {
      return resolvedQueue.shift();
    }
    const task = defer<T, E>();
    requestQueue.push(task);

    return task;
  };

  return {
    push,
    pull,
    done(value: T) {
      push(value);
      return Promise.all(
        [...pendingQueue, ...resolvedQueue, ...requestQueue].map(
          (d) => d.promise
        )
      );
    },
    get size() {
      return pendingQueue.length + resolvedQueue.length + requestQueue.length;
    },
  };
};
