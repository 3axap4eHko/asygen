export enum Status {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

const counter: [number, number] = [0,0];
export const getId = () => {
  const result = Date.now() * 100;
  if (counter[0] !== result) {
    counter[0] = result;
    counter[1] = 0;
  };
  return (counter[0] + (counter[1]++)).toString(16);
};

export class Deferred<T = void, E = unknown> {
  private txts = getId();
  private _promise: Promise<T>;
  private _resolve?: (value: T) => void;
  private _reject?: (error: E) => void;
  private _status: Status = Status.PENDING;

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
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

  resolve(value: T) {
    if (this._status === Status.PENDING) {
      this._status = Status.RESOLVED;
      this._resolve(value);
    }

    return this;
  }

  reject(error: E) {
    if (this._status === Status.PENDING) {
      this._status = Status.REJECTED;
      this._reject(error);
    }
    return this;
  }
}

export const defer = <T = void, E = unknown>() => {
  return new Deferred<T, E>();
}
