/**
 * @module natron-core
 */
import { Task } from "../task";
import { FunctionTask } from "../task/function";
import { LazyTask } from "../task/lazy";
import { TaskSequence } from "../task/sequence";
import { TaskSet } from "../task/set";

const __MAP__ = new WeakMap();

export function task(thing, meta) {
  if (isTask(thing)) {
    return thing;
  }
  if (thing instanceof Array) {
    if (!arrayIsSequence(thing)) {
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
  throw new TypeError(`${ thing } cannot be converted to task`);
}

export function isTask(thing) {
  return thing instanceof Task;
}

function arrayIsSequence(arr) {
  let c = 0;
  for (let cur = arr; cur.length === 1; cur = cur[0], c++) {
    if (!(cur[0] instanceof Array) || cur[0].meta) {
      break;
    }
  }
  return c % 2 === 0;
}

export function __map__(t) {
  let map = __MAP__.get(t);
  if (!map) {
    map = new Map();
    __MAP__.set(t, map);
  }
  return map;
}