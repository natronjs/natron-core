"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.task = task;
exports.__map__ = __map__;

var _task = require("../task");

var _function = require("../task/function");

var _lazy = require("../task/lazy");

var _sequence = require("../task/sequence");

var _set = require("../task/set");

var __MAP__ = new WeakMap(); /**
                              * @module natron-core
                              */

function task(thing, meta) {
  if (thing instanceof _task.Task) {
    return thing;
  }
  if (thing instanceof Array) {
    var c = 1;
    for (var cur = thing; cur.length === 1; cur = cur[0], c++) {
      if (!(cur[0] instanceof Array) || cur[0].meta) {
        break;
      }
    }
    if (c % 2 === 0) {
      return new _set.TaskSet(thing[0], meta);
    }
    return new _sequence.TaskSequence(thing, meta);
  }
  if (thing instanceof Function) {
    return new _function.FunctionTask(thing, meta);
  }
  if (thing instanceof Set) {
    return new _set.TaskSet(thing, meta);
  }
  if (typeof thing === "string") {
    return new _lazy.LazyTask(thing, meta);
  }
  throw new TypeError(thing + " cannot be converted to task");
}

function __map__(task) {
  var map = __MAP__.get(task);
  if (!map) {
    map = new Map();
    __MAP__.set(task, map);
  }
  return map;
}