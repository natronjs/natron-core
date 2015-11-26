/**
 * @module natron-core
 */
import {Task} from "../task";
import {TaskContext} from "../context";
import {task as ensureTask} from "../helper/task";

export class LazyTask extends Task {

  __ident__: string;

  constructor(ident: string, meta?: Object) {
    if (typeof ident !== "string") {
      throw new TypeError(`${ident} is not a valid identifier`);
    }
    super(meta);
    this.__ident__ = ident;
  }

  runWithContext(c: TaskContext): Promise {
    let context = TaskContext.create(c, this.args && {
      args: this.args,
    });
    let thing = context.resolve(this.__ident__);
    if (thing) {
      let task = ensureTask(thing);
      return task.runWithContext(context);
    }
    throw new Error(`${this.__ident__} cannot be resolved`);
  }
}
