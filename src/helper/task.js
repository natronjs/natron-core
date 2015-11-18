/**
 * @module natron-core
 */
import {Task} from "../task";
import {FunctionTask} from "../task/function";
import {LazyTask} from "../task/lazy";
import {TaskSequence} from "../task/sequence";
import {TaskSet} from "../task/set";

const __MAP__: WeakMap<Task, WeakMap<any, Task>> = new WeakMap();

export function task(thing: Thing, meta?: object): Task {
  if (thing instanceof Task) {
    return thing;
  }
  if (thing instanceof Array) {
    let c = 1;
    for (let cur = thing; cur.length === 1; cur = cur[0], c++) {
      if (!(cur[0] instanceof Array) || cur[0].meta) {
        break;
      }
    }
    if (c % 2 === 0) {
      return new TaskSet(thing[0], meta);
    }
    return new TaskSequence(thing, meta);
  }
  if (thing instanceof Function) {
    return new FunctionTask(thing, meta);
  }
  if (thing instanceof Set) {
    return new TaskSet(thing, meta);
  }
  if (typeof thing === "string") {
    return new LazyTask(thing, meta);
  }
  throw new TypeError(`${thing} cannot be converted to task`);
}

export function __map__(task: Task): Map {
  let map = __MAP__.get(task);
  if (!map) {
    __MAP__.set(task, map = new Map());
  }
  return map;
}
