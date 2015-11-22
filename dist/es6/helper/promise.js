

function promisify(value) {
  if (value && value.on) {
    if (value.pipe) {
      return promisifyStream(value);
    }
    if (value.stdio) {
      return promisifyChildProcess(value);
    }
  }
  // else if (value && value.subscribe) {
  //   return promisifyObservable(value);
  // }
  return Promise.resolve(value);
} /**
   * @module natron-core
   */

function promisifyStream(stream) {
  return new Promise((resolve, reject) => {
    stream.on(stream._write ? "finish" : "end", () => resolve({ stream }));
    stream.on("error", err => reject(err));
  });
}

function promisifyChildProcess(child) {
  return new Promise((resolve, reject) => {
    child.on("exit", (code, signal) => resolve({ child, code, signal }));
    child.on("error", err => reject(err));
  });
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