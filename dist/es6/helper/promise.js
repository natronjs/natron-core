/**
 * @module natron-core
 */

function promisify(value) {
  if (value && value.emit) {
    if (value.pipe) {
      return streamToPromise(value);
    }
    if (value.stdio) {
      return childProcessToPromise(value);
    }
  }
  return Promise.resolve(value);
}

export function defer() {
  let d,
      promise = new Promise((resolve, reject) => {
    d = { promise: null, resolve, reject };
  });
  d.promise = promise;
  return d;
}

export function callAndPromise(fn, self, ...args) {
  try {
    return promisify(fn.call(self, ...args));
  } catch (err) {
    return Promise.reject(err);
  }
}

export function applyAndPromise(fn, self, args) {
  try {
    return promisify(fn.apply(self, args));
  } catch (err) {
    return Promise.reject(err);
  }
}

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