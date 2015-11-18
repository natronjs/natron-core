/**
 * @module natron-core
 */
import { Task } from "../task";
import { TaskContext } from "../context";
import { callAndPromise } from "../helper/promise";

export class FunctionTask extends Task {

  constructor(fn, meta) {
    if (!(fn instanceof Function)) {
      throw new TypeError(`${ fn } is not a function`);
    }
    super(Object.assign({ name: fn.name }, meta || fn.meta));
    this.__fn__ = fn;
  }

  /**
   * @override
   */

  /**
   * @private
   */
  runWithContext(c) {
    let context = TaskContext.create(c);
    let { start, finish, event } = this.prepare(context);
    return start().then(() => {
      let { args } = context;
      let self = this.options.bind || context;
      return callAndPromise(this.__fn__, self, ...args);
    }).catch(err => {
      event.error = err;
      context.publish("error", event);
      return Promise.reject(err);
    }).then(finish);
  }
}