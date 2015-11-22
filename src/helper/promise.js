/**
 * @module natron-core
 */
import type {Stream} from "stream";
import type {ChildProcess} from "child_process";
import type {DeferredObject} from "natron-core";

function promisify(value: any): Promise {
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
}

function promisifyStream(stream: Stream): Promise {
  return new Promise((resolve, reject) => {
    stream.on(stream._write ? "finish": "end", () => resolve({stream}));
    stream.on("error", (err) => reject(err));
  });
}

function promisifyChildProcess(child: ChildProcess): Promise {
  return new Promise((resolve, reject) => {
    child.on("exit", (code, signal) => resolve({child, code, signal}));
    child.on("error", (err) => reject(err));
  });
}

export function defer(): DeferredObject {
  let d, promise = new Promise((resolve, reject) => {
    d = {promise: null, resolve, reject};
  });
  d.promise = promise;
  return d;
}

export function callAndPromise(fn: Function, self: Object, ...args: any): Promise {
  try {
    return promisify(fn.call(self, ...args));
  } catch (err) {
    return Promise.reject(err);
  }
}
