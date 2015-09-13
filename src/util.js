/*
 * natron-core
 */

export function callWithPromise(self: object, fn: Function, ...args?: any): Promise {
  if (this || self instanceof Function) {
    [self, fn, args] = [this, self, [fn, ...args]];
  }
  try {
    let result = fn.call(self, ...args);
    if (result && result.emit) {
      if (result.pipe) {
        return streamToPromise(result);
      }
      if (result.stdio) {
        return childProcessToPromise(result);
      }
    }
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

interface Emitter {
  emit: Function;
}

interface EmitterFn {
  (type: string, ...args: any): void;
}

export function emitWrapper(ee: Emitter, fn: EmitterFn): Function {
  let emit = ee.emit;
  ee.emit = (type: string, ...args: any) => {
    fn(type, ...args);
    return ee::emit(type, ...args);
  };
  return (rr: Function, value: any) => {
    ee.emit = emit;
    return rr(value);
  }
}

export function streamToPromise(stream: Stream): Promise {
  return new Promise((resolve, reject) => {
    let reset = emitWrapper(stream, (type: string, ...args: any) => {
      switch (type) {
        case "finish": {
          return reset(resolve, {stream});
        }
        case "error": {
          return reset(reject, args[0]);
        }
      }
    });
  });
}

export function childProcessToPromise(child: ChildProcess): Promise {
  return new Promise((resolve, reject) => {
    let reset = emitWrapper(child, (type: string, ...args: any) => {
      switch (type) {
        case "exit": {
          return reset(resolve, {child});
        }
        case "error": {
          return reset(reject, args[0]);
        }
      }
    });
  });
}
