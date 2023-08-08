import { createQueue, Deferred, Status } from '../index';

const wait = (timeout: number, value: unknown) =>
  new Promise((resolve) => setTimeout(resolve, timeout, value));

describe('createQueue test suite', () => {
  it('should create a queue', async () => {
    createQueue();
  });

  it('should push a value to the queue', async () => {
    const value = Symbol('value');
    const queue = createQueue();
    const result = queue.push(value);

    expect(result.status).toBe(Status.PENDING);
    await expect(result.promise).resolves.toBe(value);
    expect(result).toBeInstanceOf(Deferred);
    expect(result.status).toBe(Status.RESOLVED);
  });

  it('should pull a value from the queue', async () => {
    const value = Symbol('value');
    const queue = createQueue();
    const result = queue.pull();
    await expect(Promise.race([wait(1, value), result.promise])).resolves.toBe(
      value
    );
    expect(result).toBeInstanceOf(Deferred);
    expect(result.status).toBe(Status.PENDING);
  });

  it('should pull a pushed value from the queue', async () => {
    const value = Symbol('value');
    const queue = createQueue();
    queue.push(wait(1, value));
    const result = queue.pull();
    await expect(result.promise).resolves.toBe(value);
    expect(result).toBeInstanceOf(Deferred);
    expect(result.status).toBe(Status.RESOLVED);
    expect(queue.size).toBe(0);
  });

  it('should pull a few pushed values from the queue', async () => {
    const value1 = Symbol('value1');
    const value2 = Symbol('value2');
    const queue = createQueue();
    queue.push(wait(10, value2));
    queue.push(wait(0, value1));
    const result1 = queue.pull();
    const result2 = queue.pull();

    expect(result1.status).toBe(Status.PENDING);
    await expect(result1.promise).resolves.toBe(value1);
    expect(result1.status).toBe(Status.RESOLVED);

    expect(result2.status).toBe(Status.PENDING);
    await expect(result2.promise).resolves.toBe(value2);
    expect(result2.status).toBe(Status.RESOLVED);

    expect(queue.size).toBe(0);
  });

  it('should pull a few not pushed values from the queue and wait them', async () => {
    const value1 = Symbol('value1');
    const value2 = Symbol('value2');
    const queue = createQueue();

    const result1 = queue.pull();
    const result2 = queue.pull();

    setTimeout(() => {
      queue.push(wait(10, value2));
      queue.push(wait(0, value1));
    }, 100);

    expect(result1.status).toBe(Status.PENDING);
    await expect(result1.promise).resolves.toBe(value1);
    expect(result1.status).toBe(Status.RESOLVED);

    expect(result2.status).toBe(Status.PENDING);
    await expect(result2.promise).resolves.toBe(value2);
    expect(result2.status).toBe(Status.RESOLVED);

    expect(queue.size).toBe(0);
  });
});
