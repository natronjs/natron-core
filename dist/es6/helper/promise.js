

export function callAndPromise(fn, self, ...args) {
  if (this) {
    [fn, self, args] = [this, fn, [self, ...args]];
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
} /**
   * @module natron-core
   */

export function streamToPromise(stream) {
  return new Promise((resolve, reject) => {
    let reset = emitWrapper(stream, (type, ...args) => {
      switch (type) {
        case "end":
        case "finish":
          {
            return reset(resolve, { stream });
          }
        case "error":
          {
            return reset(reject, args[0]);
          }
      }
    });
  });
}

export function childProcessToPromise(child) {
  return new Promise((resolve, reject) => {
    let reset = emitWrapper(child, (type, ...args) => {
      switch (type) {
        case "exit":
          {
            return reset(resolve, { child });
          }
        case "error":
          {
            return reset(reject, args[0]);
          }
      }
    });
  });
}

export function emitWrapper(ee, fn) {
  let emit = ee.emit;
  ee.emit = (type, ...args) => {
    fn(type, ...args);
    return emit.call(ee, type, ...args);
  };
  return (rr, value) => {
    ee.emit = emit;
    return rr(value);
  };
}