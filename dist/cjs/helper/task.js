"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.task = task;
exports.isTask = isTask;

var _task = require("../task");

var _function = require("../task/function");

var _lazy = require("../task/lazy");

var _sequence = require("../task/sequence");

var _set = require("../task/set");

function task(thing, meta) {
  if (isTask(thing)) {
    if (meta) {
      return thing.clone(meta !== true ? meta : null);
    }
    return thing;
  }
  if (thing instanceof Array) {
    if (!arrayIsSequence(thing)) {
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
  throw new TypeError(thing + " cannot be converted to Task");
} /**
   * @module natron-core
   */

function isTask(thing) {
  return thing instanceof _task.Task;
}

function arrayIsSequence(arr) {
  var c = 0;
  for (var cur = arr; cur.length === 1; cur = cur[0], c++) {
    if (!(cur[0] instanceof Array) || cur[0].meta) {
      break;
    }
  }
  return c % 2 === 0;
}