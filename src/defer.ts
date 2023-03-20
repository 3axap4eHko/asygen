export enum State {
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
  private _state: State = State.PENDING;

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = (value: T) => {
        this._state = State.RESOLVED;
        resolve(value);
      };
      this._reject = (error: unknown) => {
        this._state = State.REJECTED;
        reject(error)
      };
    });
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }

  get [Symbol.toStringTag]() {
    return `Deffer ${this.txts} ${this._state}`;
  }

  get promise() {
    return this._promise;
  }

  get state() {
    return this._state;
  }

  resolve(value: T) {
    if (this._state === State.PENDING) {
      this._resolve && this._resolve(value);
    }
    return this;
  }

  reject(error: E) {
    if (this._state === State.PENDING) {
      this._reject && this._reject(error);
    }
    return this;
  }
}

export const defer = <T = void, E = unknown>() => {
  return new Deferred<T, E>();
}
