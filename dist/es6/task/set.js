/**
 * @module natron-core
 */
import { Task } from "../task";
import { TaskContext } from "../context";
import { task as ensureTask, __map__ } from "../helper/task";

export class TaskSet extends Task {

  constructor(things, meta) {
    if (things && !things[Symbol.iterator]) {
      throw new TypeError(`${ things } is not iterable`);
    }
    super(meta || things && things.meta);
    this.__set__ = new Set();
    things && this.addAll(things);
  }

  runWithContext(c) {
    let context = TaskContext.create(c);
    let { start, finish } = this.prepare(context);
    return start().then(() => {
      let promises = [];
      for (let task of this.__set__) {
        let context_ = context.clone({ stack: true });
        promises.push(task.runWithContext(context_));
      }
      return Promise.all(promises);
    }).then(finish);
  }

  get size() {
    return this.__set__.size;
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
    this.__set__.add(task);
  }

  addAll(things) {
    for (let thing of things) {
      this.add(thing);
    }
  }

  clear() {
    this.__set__.clear();
    __map__(this).clear();
  }

  delete(thing) {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = __map__(this).get(thing);
      if (task) {
        __map__(this).delete(thing);
      }
    }
    return this.__set__.delete(task);
  }

  has(thing) {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = __map__(this).get(thing);
    }
    return this.__set__.has(task);
  }

  [Symbol.iterator]() {
    return this.__set__[Symbol.iterator]();
  }
}