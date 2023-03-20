import { defer, Status, Deferred, getId } from '../index';

describe('getId test suite', () => {
  it('should generate id', () => {
    const id = getId();
    expect(id).toMatch(/^[0-9a-f]{12}$/);
  });
});

describe('Deferred test suite', () => {
  it('should instantiate defer token with pending status', () => {
    const token = defer();
    expect(token instanceof Deferred).toBe(true);
    expect(token.status).toEqual(Status.PENDING);
    expect(`${token}`).toMatch(/Deferred [0-9a-f]{12} pending/);
  });

  it('should resolve defer token and change status', async () => {
    const token = defer();
    process.nextTick(token.resolve, 'test');
    await expect(token.promise).resolves.toEqual('test');
    expect(token.status).toEqual(Status.RESOLVED);
    expect(`${token}`).toMatch(/Deferred [0-9a-f]{12} resolved/);
  });

  it('should reject defer token and change status', async () => {
    const token = defer();
    process.nextTick(token.reject, 'test');
    await expect(token.promise).rejects.toEqual('test');
    expect(token.status).toEqual(Status.REJECTED);
    expect(`${token}`).toMatch(/Deferred [0-9a-f]{12} rejected/);
  });
});
