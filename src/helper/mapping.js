/**
 * @module natron-core
 */
import type {Thing, Task} from "../task";

const __MAP__: WeakMap<Object, Map<Thing, Task>> = new WeakMap();

const TaskMapping = {

  mapping(obj: Object): Map<Thing, Task> {
    let map = __MAP__.get(obj);
    if (!map) {
      __MAP__.set(obj, (map = new Map()));
    }
    return map;
  },

  clear(obj: Object): void {
    this.mapping(obj).clear();
  },

  get(obj: Object, thing: Thing): Task {
    return this.mapping(obj).get(thing);
  },

  has(obj: Object, thing: Thing): boolean {
    return this.mapping(obj).has(thing);
  },

  set(obj: Object, thing: Thing, task: Task): void {
    this.mapping(obj).set(thing, task);
  },
};

export {TaskMapping};
