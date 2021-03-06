"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _task = require("./helper/task");

Object.defineProperty(exports, "task", {
  enumerable: true,
  get: function get() {
    return _task.task;
  }
});
Object.defineProperty(exports, "isTask", {
  enumerable: true,
  get: function get() {
    return _task.isTask;
  }
});

var _promise = require("./helper/promise");

Object.defineProperty(exports, "promisify", {
  enumerable: true,
  get: function get() {
    return _promise.promisify;
  }
});
Object.defineProperty(exports, "defer", {
  enumerable: true,
  get: function get() {
    return _promise.defer;
  }
});

var _task2 = require("./task");

Object.defineProperty(exports, "Task", {
  enumerable: true,
  get: function get() {
    return _task2.Task;
  }
});

var _context = require("./context");

Object.defineProperty(exports, "TaskContext", {
  enumerable: true,
  get: function get() {
    return _context.TaskContext;
  }
});

var _function = require("./task/function");

Object.defineProperty(exports, "FunctionTask", {
  enumerable: true,
  get: function get() {
    return _function.FunctionTask;
  }
});

var _lazy = require("./task/lazy");

Object.defineProperty(exports, "LazyTask", {
  enumerable: true,
  get: function get() {
    return _lazy.LazyTask;
  }
});

var _sequence = require("./task/sequence");

Object.defineProperty(exports, "TaskSequence", {
  enumerable: true,
  get: function get() {
    return _sequence.TaskSequence;
  }
});

var _set = require("./task/set");

Object.defineProperty(exports, "TaskSet", {
  enumerable: true,
  get: function get() {
    return _set.TaskSet;
  }
});