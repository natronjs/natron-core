

const __MAP__ = new WeakMap(); /**
                                * @module natron-core
                                */

const TaskMapping = {

  mapping(obj) {
    let map = __MAP__.get(obj);
    if (!map) {
      __MAP__.set(obj, map = new Map());
    }
    return map;
  },

  clear(obj) {
    this.mapping(obj).clear();
  },

  get(obj, thing) {
    return this.mapping(obj).get(thing);
  },

  has(obj, thing) {
    return this.mapping(obj).has(thing);
  },

  set(obj, thing, task) {
    this.mapping(obj).set(thing, task);
  }
};

export { TaskMapping };