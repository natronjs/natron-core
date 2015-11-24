/**
 * @module natron-core
 */
import { Task } from "../task";
import { TaskContext } from "../context";
import { task as ensureTask } from "../helper/task";

export class LazyTask extends Task {

  constructor(ident, meta) {
    if (typeof ident !== "string") {
      throw new TypeError(`${ ident } is not a valid identifier`);
    }
    super(meta);
    this.__ident__ = ident;
  }

  runWithContext(c) {
    let context = TaskContext.create(c);
    let thing = context.resolve(this.__ident__);
    if (thing) {
      let task = ensureTask(thing);
      return task.runWithContext(context);
    }
    throw new Error(`${ this.__ident__ } cannot be resolved`);
  }
}