/**
 * @module natron-core
 */
import { Task } from "../task";
import { TaskContext } from "../context";
import { task as ensureTask } from "../helper/task";
import { TaskMapping } from "../helper/mapping";

export class TaskSequence extends Task {

  constructor(things, meta) {
    if (things && !things[Symbol.iterator]) {
      throw new TypeError(`${ things } is not iterable`);
    }
    super(meta || things && things.meta);
    this.__sequence__ = [];
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
    let { start, finish, error } = this.prepare(context);
    let promise = start();

    let settle = this.options.settle;
    let result = [];

    for (let i = 0; i < this.__sequence__.length; i++) {
      let task = this.__sequence__[i];

      promise = promise.then(value => {
        let context_ = context;
        if (i) {
          if (this.options.pipe) {
            context_ = context.clone({ args: [value] });
          }
          result.push(value);
        }
        let promise_ = task.runWithContext(context_);

        if (settle instanceof Function) {
          promise_ = promise_.catch(err => settle({
            task, context: context_, error: err
          }));
        } else if (settle) {
          promise_ = promise_.catch(() => null);
        }
        return promise_;
      });
    }

    if (!this.options.pipe) {
      promise = promise.then(value => {
        result.push(value);
        return result;
      });
    }

    return promise.catch(error).then(finish);
  }

  get size() {
    return this.__sequence__.length;
  }

  clone(init, deep) {
    let task = super.clone(init, deep);
    if (deep) {
      task.__sequence__ = this.__sequence__.slice();
      TaskMapping.clone(this.__sequence__, task.__sequence__);
    }
    return task;
  }

  add(thing) {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = TaskMapping.get(this.__sequence__, thing);
      if (!task) {
        task = ensureTask(thing);
        TaskMapping.set(this.__sequence__, thing, task);
      }
    }
    this.__sequence__.push(task);
  }

  clear() {
    this.__sequence__.length = 0;
    TaskMapping.clear(this.__sequence__);
  }

  delete(thing) {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = TaskMapping.get(this.__sequence__, thing);
    }
    let index = this.__sequence__.indexOf(task);
    if (index !== -1) {
      this.__sequence__.splice(index, 1);
      return true;
    }
    return false;
  }

  has(thing) {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = TaskMapping.get(this.__sequence__, thing);
    }
    let index = this.__sequence__.indexOf(task);
    return index !== -1;
  }

  [Symbol.iterator]() {
    return this.__sequence__[Symbol.iterator]();
  }
}