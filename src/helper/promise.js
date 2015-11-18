/**
 * @module natron-core
 */
import type {ChildProcess} from "child_process";
import type {EventEmitter} from "events";
import type {Stream} from "stream";

export function callAndPromise(fn: Function, self: object, ...args: any): Promise {
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
  }
}
