/**
 * @module natron-core
 */
import { Task } from "../task";
import { TaskContext } from "../context";
import { task as ensureTask } from "../helper/task";
import { TaskMapping } from "../helper/mapping";

export class TaskSet extends Task {

  constructor(things, meta) {
    if (things && !things[Symbol.iterator]) {
      throw new TypeError(`${ things } is not iterable`);
    }
    super(meta || things && things.meta);
    this.__set__ = new Set();
    if (things) {
      for (let thing of things) {
        this.add(thing);
      }
    }
  }

  runWithContext(c) {
    let context = TaskContext.create(c, this.args && {
      args: this.args
    });
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
      task = TaskMapping.get(this.__set__, thing);
      if (!task) {
        task = ensureTask(thing);
        TaskMapping.set(this.__set__, thing, task);
      }
    }
    this.__set__.add(task);
  }

  clear() {
    this.__set__.clear();
    TaskMapping.clear(this.__set__);
  }

  delete(thing) {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = TaskMapping.get(this.__set__, thing);
    }
    return this.__set__delete(task);
  }

  has(thing) {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = TaskMapping.get(this.__set__, thing);
    }
    return this.__set__.has(task);
  }

  [Symbol.iterator]() {
    return this.__set__[Symbol.iterator]();
  }
}