/**
 * @module natron-core
 */
import {Task} from "../task";
import {TaskContext} from "../context";
import {callAndPromise} from "../helper/promise";
import {mergeMeta} from "../helper/meta";

export class FunctionTask extends Task {

  __fn__: Function;

  constructor(fn: Function, meta?: Object) {
    if (!(fn instanceof Function)) {
      throw new TypeError(`${fn} is not a function`);
    }
    super(mergeMeta({name: fn.name}, meta || fn.meta));
    this.__fn__ = fn;
  }

  runWithContext(c: TaskContext): Promise {
    let context = TaskContext.create(c, this.args && {
      args: this.args,
    });
    let {start, finish, e} = this.prepare(context);
    let hasBind = this.options.hasOwnProperty("bind");
    return (start()
      .then(() => {
        let self = context;
        let args = context.args;
        if (hasBind && this.options.bind !== null) {
          self = this.options.bind;
        }
        if (this.options.injectContext) {
          args = [context];
        }
        return callAndPromise(this.__fn__, self, ...args);
      })
      .catch((err) => {
        e.error = err;
        context.publish("error", e);
        return Promise.reject(err);
      })
      .then(finish)
    );
  }
}
