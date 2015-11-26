/**
 * @module natron-core
 */
import {Task} from "../task";
import {TaskContext} from "../context";
import {task as ensureTask} from "../helper/task";
import {TaskMapping} from "../helper/mapping";
import type {Thing} from "../task";

export class TaskSequence extends Task {

  __sequence__: Array<Task> = [];

  constructor(things: Iterable<Thing>, meta?: Object) {
    if (things && !things[Symbol.iterator]) {
      throw new TypeError(`${things} is not iterable`);
    }
    super(meta || things && things.meta);
    if (things) {
      for (let thing of things) {
        this.add(thing);
      }
    }
  }

  runWithContext(c: TaskContext): Promise {
    let context = TaskContext.create(c, this.args && {
      args: this.args,
    });

    let {start, finish} = this.prepare(context);
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
      promise = promise.then((value) => {
        if (this.options.pipe) {
          let context_ = context.clone({args: [value]});
          return task.runWithContext(context_);
        }
        result.push(value);
        return task.runWithContext(context);
      });
    }

    if (!this.options.pipe) {
      promise = promise.then((value) => {
        result.push(value);
        return result;
      });
    }
    return promise.then(finish);
  }

  get size(): number {
    return this.__sequence__.length;
  }

  clone(init?: Object, deep?: boolean): TaskSequence {
    let task = super.clone(init, deep);
    if (deep) {
      task.__sequence__ = this.__sequence__.slice();
      TaskMapping.clone(this.__sequence__, task.__sequence__);
    }
    return task;
  }

  add(thing: Thing): void {
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

  clear(): void {
    this.__sequence__.length = 0;
    TaskMapping.clear(this.__sequence__);
  }

  delete(thing: Thing): boolean {
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

  has(thing: Thing): boolean {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = TaskMapping.get(this.__sequence__, thing);
    }
    let index = this.__sequence__.indexOf(task);
    return index !== -1;
  }

  [Symbol.iterator](): Iterator {
    return this.__sequence__[Symbol.iterator]();
  }
}
