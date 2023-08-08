export enum Status {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

const counter: [number, number] = [0, 0];
export const getId = () => {
  const result = Date.now() * 100;
  if (counter[0] !== result) {
    counter[0] = result;
    counter[1] = 0;
  }
  return (counter[0] + counter[1]++).toString(16);
};

export class Deferred<T = void, S = unknown, E = unknown> {
  private txts = getId();
  private _promise: Promise<T>;
  private _resolve?: (value: T | PromiseLike<T>) => void;
  private _reject?: (error: E) => void;
  private _status: Status = Status.PENDING;

  public state: S;

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    })
      .catch((error) => {
        this._status = Status.REJECTED;
        throw error;
      })
      .then((value) => {
        this._status = Status.RESOLVED;
        return value;
      });
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  get id() {
    return this.txts;
  }

  get [Symbol.toStringTag]() {
    return `Deferred ${this.txts} ${this._status}`;
  }

  get promise() {
    return this._promise;
  }

  get status() {
    return this._status;
  }

  resolve(value: T | PromiseLike<T>) {
    this._resolve(value);

    return this;
  }

  reject(error: E) {
    this._reject(error);

    return this;
  }
}

export const defer = <T = void, E = unknown>() => {
  return new Deferred<T, E>();
};
