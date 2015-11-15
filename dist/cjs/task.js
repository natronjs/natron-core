"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * natron-core
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazyTask = exports.TaskSet = exports.TaskSequence = exports.TaskCollection = exports.FunctionTask = exports.Task = undefined;
exports.task = task;

var _promise = require("./promise");

var _context = require("./context");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = exports.Task = (function () {
  function Task(meta) {
    _classCallCheck(this, Task);

    this.options = {};

    if (meta) {
      if (meta.options) {
        _extends(this.options, meta.options);
      }
      if (meta.name) {
        this.name = meta.name;
      }
      if (meta.description) {
        this.description = meta.description;
      }
    }
  }

  _createClass(Task, [{
    key: "run",
    value: function run() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.runWithContext({ args: args });
    }
  }]);

  return Task;
})();

var FunctionTask = exports.FunctionTask = (function (_Task) {
  _inherits(FunctionTask, _Task);

  function FunctionTask(fn, meta) {
    _classCallCheck(this, FunctionTask);

    if (!(fn instanceof Function)) {
      throw new TypeError(fn + " is not a function");
    }
    meta = meta || fn.meta || {};
    if (!meta.name) {
      meta.name = fn.name;
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FunctionTask).call(this, meta));

    _this.__fn__ = fn;
    return _this;
  }

  _createClass(FunctionTask, [{
    key: "runWithContext",
    value: function runWithContext(c) {
      var _prepareTask = prepareTask({ task: this, context: c });

      var context = _prepareTask.context;
      var finisher = _prepareTask.finisher;
      var e = _prepareTask.e;

      var self = this.options.bind || context;
      return _promise.callAndPromise.apply(undefined, [this.__fn__, self].concat(_toConsumableArray(context.args))).catch(function (err) {
        e.error = err;
        context.publish("error", e);
        return Promise.reject(err);
      }).then(finisher);
    }
  }]);

  return FunctionTask;
})(Task);

var TaskCollection = exports.TaskCollection = (function (_Task2) {
  _inherits(TaskCollection, _Task2);

  function TaskCollection(meta) {
    _classCallCheck(this, TaskCollection);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(TaskCollection).call(this, meta));

    if (meta && meta.resolver) {
      _this2.resolver = meta.resolver;
    }
    return _this2;
  }

  return TaskCollection;
})(Task);

var TaskSequence = exports.TaskSequence = (function (_TaskCollection) {
  _inherits(TaskSequence, _TaskCollection);

  function TaskSequence(things, meta) {
    _classCallCheck(this, TaskSequence);

    if (things && !things[Symbol.iterator]) {
      throw new TypeError(things + " is not iterable");
    }

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(TaskSequence).call(this, meta || things && things.meta));

    _this3.__sequence__ = [];
    if (things) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = things[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var thing = _step.value;

          _this3.add(thing);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    return _this3;
  }

  _createClass(TaskSequence, [{
    key: "runWithContext",
    value: function runWithContext(c) {
      var _this4 = this;

      var _prepareTask2 = prepareTask({
        task: this, context: c,
        result: !this.options.pipe && []
      });

      var context = _prepareTask2.context;
      var finisher = _prepareTask2.finisher;
      var result = _prepareTask2.result;

      var promise = this.__sequence__[0] ? this.__sequence__[0].runWithContext(context) : Promise.resolve();

      var _loop = function _loop(i, _task2) {
        _task2 = _this4.__sequence__[i];
        promise = promise.then(function (value) {
          if (_this4.options.pipe) {
            context = context.clone({ args: [value] });
          } else {
            result.push(value);
          }
          return _task2.runWithContext(context);
        });
        _task = _task2;
      };

      for (var _task = undefined, i = 1; i < this.__sequence__.length; i++) {
        _loop(i, _task);
      }
      return promise.then(finisher);
    }
  }, {
    key: "add",
    value: function add(thing) {
      if (thing instanceof Task) {
        return this.__sequence__.push(thing);
      }
      if (!this.__sequence__.__map__) {
        this.__sequence__.__map__ = new Map();
      }
      var task = this.__sequence__.__map__.get(thing);
      if (!task) {
        task = ensureTask(thing);
        this.__sequence__.__map__.set(thing, task);
      }
      return this.__sequence__.push(task);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.__sequence__.length = 0;
      if (this.__sequence__.__map__) {
        this.__sequence__.__map__.clear();
      }
    }
  }, {
    key: Symbol.iterator,
    value: function value() {
      return this.__sequence__[Symbol.iterator]();
    }
  }, {
    key: "size",
    get: function get() {
      return this.__sequence__.length;
    }
  }]);

  return TaskSequence;
})(TaskCollection);

var TaskSet = exports.TaskSet = (function (_TaskCollection2) {
  _inherits(TaskSet, _TaskCollection2);

  function TaskSet(things, meta) {
    _classCallCheck(this, TaskSet);

    if (things && !things[Symbol.iterator]) {
      throw new TypeError(things + " is not iterable");
    }

    var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(TaskSet).call(this, meta || things && things.meta));

    _this5.__set__ = new Set();
    if (things) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = things[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var thing = _step2.value;

          _this5.add(thing);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
    return _this5;
  }

  _createClass(TaskSet, [{
    key: "runWithContext",
    value: function runWithContext(c) {
      var _prepareTask3 = prepareTask({ task: this, context: c });

      var context = _prepareTask3.context;
      var finisher = _prepareTask3.finisher;

      var promises = [];
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.__set__[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _task3 = _step3.value;

          var context_ = context.clone({ stack: true });
          promises.push(_task3.runWithContext(context_));
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return Promise.all(promises).then(finisher);
    }
  }, {
    key: "add",
    value: function add(thing) {
      if (thing instanceof Task) {
        return this.__set__.add(thing);
      }
      if (!this.__set__.__map__) {
        this.__set__.__map__ = new Map();
      }
      if (!this.__set__.__map__.has(thing)) {
        var _task4 = ensureTask(thing);
        this.__set__.__map__.set(thing, _task4);
        return this.__set__.add(_task4);
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.__set__.clear();
      if (this.__set__.__map__) {
        this.__set__.__map__.clear();
      }
    }
  }, {
    key: "delete",
    value: function _delete(thing) {
      if (!(thing instanceof Task) && this.__set__.__map__) {
        var _task5 = this.__set__.__map__.get(thing);
        if (_task5) {
          this.__set__.__map__.delete(thing);
        }
        return this.__set__.delete(_task5);
      }
      return this.__set__.delete(thing);
    }
  }, {
    key: "has",
    value: function has(thing) {
      if (!(thing instanceof Task) && this.__set__.__map__) {
        return this.__set__.__map__.has(thing);
      }
      return this.__set__.has(thing);
    }
  }, {
    key: Symbol.iterator,
    value: function value() {
      return this.__set__[Symbol.iterator]();
    }
  }, {
    key: "size",
    get: function get() {
      return this.__set__.size;
    }
  }]);

  return TaskSet;
})(TaskCollection);

var LazyTask = exports.LazyTask = (function (_Task3) {
  _inherits(LazyTask, _Task3);

  function LazyTask(ident, meta) {
    _classCallCheck(this, LazyTask);

    if (typeof ident !== "string") {
      throw new TypeError(ident + " is not a valid identifier");
    }

    var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(LazyTask).call(this, meta));

    _this6.__ident__ = ident;
    return _this6;
  }

  _createClass(LazyTask, [{
    key: "runWithContext",
    value: function runWithContext(c) {
      throw new Error("Not yet implemented");
    }
  }]);

  return LazyTask;
})(Task);

function ensureTask(thing, meta) {
  if (thing instanceof Task) {
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
  throw new TypeError(thing + " cannot be converted to task");
}

function prepareTask(_ref) {
  var task = _ref.task;
  var context = _ref.context;
  var result = _ref.result;

  if (!(context instanceof _context.TaskContext)) {
    context = new _context.TaskContext(context);
  }
  context.stack.push(task);
  var e = { task: task, context: context };
  context.publish("start", e);
  var finisher = function finisher(value) {
    if (result) {
      result.push(value);
      value = result;
    }
    e.value = value;
    context.publish("finish", e);
    context.stack.pop();
    return value;
  };
  return { context: context, result: result, finisher: finisher, e: e };
}

function task(thing, meta) {
  return ensureTask(thing, meta);
}