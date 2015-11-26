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
    let {start, finish} = this.prepare(context);
    return (start()
      .then(() => {
        let promises = [];
        for (let task of this.__set__) {
          let context_ = context.clone({stack: true});
          promises.push(task.runWithContext(context_));
        }
        return Promise.all(promises);
      })
      .then(finish)
    );
  }

  get size(): number {
    return this.__set__.size;
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
    return this.__set__delete(task);
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
