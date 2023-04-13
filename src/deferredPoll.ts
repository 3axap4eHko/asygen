import { defer, Deferred } from './defer';

export const createPoll = <T>() => {
  const dPoll: Deferred<T>[] = [defer<T>()];

  return {
    push(value: T) {
      const next = defer<T>();
      const prev = dPoll.push(next) - 2;
      const prevDeferred = dPoll[prev] as Deferred<T>;
      prevDeferred.resolve(value);

      return prevDeferred;
    },
    pull() {
      const current = dPoll[0];
      current.promise.then(() => dPoll.shift());
      return current;
    },
    done(value: T) {
      dPoll[dPoll.length - 1].resolve(value);
      return Promise.all(dPoll.map(d => d.promise));
    }
  };
}
