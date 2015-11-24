/**
 * @module natron-core
 */
import { Task } from "../task";
import { TaskContext } from "../context";
import { task as ensureTask, __map__ } from "../helper/task";

export class TaskSequence extends Task {

  constructor(things, meta) {
    if (things && !things[Symbol.iterator]) {
      throw new TypeError(`${ things } is not iterable`);
    }
    super(meta || things && things.meta);
    this.__sequence__ = [];
    things && this.addAll(things);
  }

  runWithContext(c) {
    let context = TaskContext.create(c);
    let { start, finish } = this.prepare(context);
    let promise = start();
    if (this.__sequence__[0]) {
      let task = this.__sequence__[0];
      promise = promise.then(() => {
        return task.runWithContext(context);
      });
    }
    let result = [];
    for (let i = 1; i < this.__sequence__.length; i++) {
      let task = this.__sequence__[i];
      promise = promise.then(value => {
        if (this.options.pipe) {
          let context_ = context.clone({ args: [value] });
          return task.runWithContext(context_);
        }
        result.push(value);
        return task.runWithContext(context);
      });
    }
    if (!this.options.pipe) {
      promise = promise.then(value => {
        result.push(value);
        return result;
      });
    }
    return promise.then(finish);
  }

  get size() {
    return this.__sequence__.length;
  }

  add(thing) {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = __map__(this).get(thing);
      if (!task) {
        task = ensureTask(thing);
        __map__(this).set(thing, task);
      }
    }
    this.__sequence__.push(task);
  }

  addAll(things) {
    for (let thing of things) {
      this.add(thing);
    }
  }

  clear() {
    this.__sequence__.length = 0;
    __map__(this).clear();
  }

  delete(thing) {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = __map__(this).get(thing);
    }
    let index = this.__sequence__.indexOf(task);
    if (index !== -1) {
      this.__sequence__.splice(index, 1);
      return true;
    }
    return false;
  }

  [Symbol.iterator]() {
    return this.__sequence__[Symbol.iterator]();
  }
}