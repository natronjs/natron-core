/**
 * @module natron-core
 */
import {Task} from "../task";
import {TaskContext} from "../context";
import {task as ensureTask} from "../helper/task";
import {TaskMapping} from "../helper/mapping";
import type {Thing} from "../task";

export class TaskSet extends Task {

  __set__: Set<Task> = new Set();

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
    let {start, finish, error} = this.prepare(context);
    let promise = start();

    let settle = this.options.settle;

    promise = promise.then(() => {
      let promises = [];
      for (let task of this.__set__) {
        let context_ = context.clone({stack: true});
        let promise_ = task.runWithContext(context_);

        if (settle instanceof Function) {
          promise_ = promise_.catch((err) => settle({
            task, context: context_, error: err,
          }));
        } else if (settle) {
          promise_ = promise_.catch(() => null);
        }
        promises.push(promise_);
      }
      return Promise.all(promises);
    });

    return (promise
      .catch(error)
      .then(finish)
    );
  }

  get size(): number {
    return this.__set__.size;
  }

  clone(init?: Object, deep?: boolean): TaskSet {
    let task = super.clone(init, deep);
    if (deep) {
      task.__set__ = new Set(this.__set__);
      TaskMapping.clone(this.__set__, task.__set__);
    }
    return task;
  }

  add(thing: Thing): void {
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

  clear(): void {
    this.__set__.clear();
    TaskMapping.clear(this.__set__);
  }

  delete(thing: Thing): boolean {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = TaskMapping.get(this.__set__, thing);
    }
    return this.__set__.delete(task);
  }

  has(thing: Thing): boolean {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = TaskMapping.get(this.__set__, thing);
    }
    return this.__set__.has(task);
  }

  [Symbol.iterator](): Iterator {
    return this.__set__[Symbol.iterator]();
  }
}
