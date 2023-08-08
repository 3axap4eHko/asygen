import { generatorify, Task } from '../index';

describe('Generatorify test suite', () => {
  it('should iterate an array syncronously', async () => {
    const array = [0, 1, 2, 3, 4];
    const handler = jest.fn();
    for await (const value of generatorify(array.forEach.bind(array))) {
      handler(value);
    }
    expect(handler).toBeCalledTimes(array.length);
    for (const value of array) {
      expect(handler).toBeCalledWith(value);
    }
  });

  it('should iterate an array asyncronously', async () => {
    const array = [0, 1, 2, 3, 4];
    const handler = jest.fn();
    const task: Task<number> = async (send) => {
      for (const value of array) {
        await new Promise((r) => setTimeout(r, value * 10));
        await send(value);
      }
    };
    for await (const value of generatorify(task)) {
      handler(value);
    }
    expect(handler).toBeCalledTimes(array.length);
    for (const value of array) {
      expect(handler).toBeCalledWith(value);
    }
  });
});
