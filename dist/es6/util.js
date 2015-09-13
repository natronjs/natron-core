/*
 * natron-core
 */

"use strict";

export { callWithPromise };
export { emitWrapper };
export { streamToPromise };
export { childProcessToPromise };

function callWithPromise(self, fn, ...args) {
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

function emitWrapper(ee, fn) {
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

function streamToPromise(stream) {
  return new Promise((resolve, reject) => {
    let reset = emitWrapper(stream, (type, ...args) => {
      switch (type) {
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

function childProcessToPromise(child) {
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