import { combine } from '../index';

const sleep = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));

async function* generate(timeout: number, count: number) {
  for (let index = 0; index < count; index++) {
    yield index;
    await sleep(timeout);
  }
}

describe('Combine test suite', () => {
  it('should combine 0 asyncIterators', async () => {
    const handler = jest.fn();
    for await (const value of combine()) {
      handler(value);
    }
    expect(handler).not.toBeCalled();
  });

  it('should combine a few asyncIterators', async () => {
    const handler = jest.fn();
    for await (const value of combine(generate(100, 5), generate(500, 2))) {
      handler(value);
    }
    // 0 1 2 3 4 -
    // 0 . . . . 1
    expect(handler).toHaveBeenNthCalledWith(1, 0);
    expect(handler).toHaveBeenNthCalledWith(2, 0);
    expect(handler).toHaveBeenNthCalledWith(3, 1);
    expect(handler).toHaveBeenNthCalledWith(4, 2);
    expect(handler).toHaveBeenNthCalledWith(5, 3);
    expect(handler).toHaveBeenNthCalledWith(6, 4);
    expect(handler).toHaveBeenNthCalledWith(7, 1);
  });
});
