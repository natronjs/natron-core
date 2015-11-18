/**
 * @module natron-core
 */
import {Task} from "../task";
import {TaskContext} from "../context";
import {task as ensureTask, __map__} from "../helper/task";

export class TaskSet extends Task {

  /**
   * @private
   */
  __set__: Set<Task> = new Set();

  constructor(things: iterable<Thing>, meta?: object) {
    if (things && !things[Symbol.iterator]) {
      throw new TypeError(`${things} is not iterable`);
    }
    super(meta || things && things.meta);
    things && this.addAll(things);
  }

  /**
   * @override
   */
  runWithContext(c: TaskContext): Promise {
    let context = TaskContext.create(c);
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
      task = __map__(this).get(thing);
      if (!task) {
        task = ensureTask(thing);
        __map__(this).set(thing, task);
      }
    }
    this.__set__.add(task);
  }

  addAll(things: iterable<Thing>): void {
    for (let thing of things) {
      this.add(thing);
    }
  }

  clear(): void {
    this.__set__.clear();
    __map__(this).clear();
  }

  delete(thing: Thing): boolean {
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

  has(thing: Thing): boolean {
    let task;
    if (thing instanceof Task) {
      task = thing;
    } else {
      task = __map__(this).get(thing);
    }
    return this.__set__.has(task);
  }

  [Symbol.iterator](): Iterator {
    return this.__set__[Symbol.iterator]();
  }
}
