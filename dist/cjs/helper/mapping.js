"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var __MAP__ = new WeakMap(); /**
                              * @module natron-core
                              */

var TaskMapping = {
  mapping: function mapping(obj) {
    var map = __MAP__.get(obj);
    if (!map) {
      __MAP__.set(obj, map = new Map());
    }
    return map;
  },
  clear: function clear(obj) {
    this.mapping(obj).clear();
  },
  get: function get(obj, thing) {
    return this.mapping(obj).get(thing);
  },
  has: function has(obj, thing) {
    return this.mapping(obj).has(thing);
  },
  set: function set(obj, thing, task) {
    this.mapping(obj).set(thing, task);
  }
};

exports.TaskMapping = TaskMapping;