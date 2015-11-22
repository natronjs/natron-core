/**
 * @module natron-core
 */
import type {ChildProcess} from "child_process";
import type {EventEmitter} from "events";
import type {Stream} from "stream";
import type {DeferredObject} from "natron-core";

function promisify(value: any): Promise {
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

export function applyAndPromise(fn: Function, self: Object, args: Array<any>): Promise {
  try {
    return promisify(fn.apply(self, args));
  } catch (err) {
    return Promise.reject(err);
  }
}

export function streamToPromise(stream: Stream): Promise {
  return new Promise((resolve, reject) => {
    let reset = emitWrapper(stream, (type: string, ...args: any) => {
      switch (type) {
        case "end":
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

export function emitWrapper(ee: EventEmitter, fn: Function): Function {
  let emit = ee.emit;
  ee.emit = (type: string, ...args: any) => {
    fn(type, ...args);
    return emit.call(ee, type, ...args);
  };
  return (rr: Function, value: any) => {
    ee.emit = emit;
    return rr(value);
  };
}
