/*
 * natron-core
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.task = task;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _objectAssign = require("object-assign");

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _yaee = require("yaee");

var _context = require("./context");

var _util = require("./util");

var Task = (function (_EventEmitter) {
  _inherits(Task, _EventEmitter);

  function Task() {
    _classCallCheck(this, Task);

    _get(Object.getPrototypeOf(Task.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(Task, [{
    key: "run",
    value: function run() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var context = _context.TaskContext.create({ args: args });
      return this.runWithContext.apply(this, [context].concat(_toConsumableArray(args)));
    }
  }], [{
    key: "create",
    value: function create(thing) {
      if (this !== Task) {
        return;
      }
      return ensureTask.call(thing, null);
    }
  }, {
    key: "run",
    value: function run(thing) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var context = _context.TaskContext.create({ args: args });
      return runWithContext.call.apply(runWithContext, [thing, context].concat(_toConsumableArray(args)));
    }
  }]);

  return Task;
})(_yaee.EventEmitter);

exports.Task = Task;

var FunctionTask = (function (_Task) {
  _inherits(FunctionTask, _Task);

  function FunctionTask(fn) {
    _classCallCheck(this, FunctionTask);

    _get(Object.getPrototypeOf(FunctionTask.prototype), "constructor", this).call(this);
    if (!(fn instanceof Function)) {
      throw new TypeError(fn + " is not a function");
    }
    this.fn = fn;
  }

  _createClass(FunctionTask, [{
    key: "runWithContext",
    value: function runWithContext(context) {
      var resolver = taskPrepareContext(context, this);

      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      var promise = _util.callWithPromise.apply(undefined, [this.fn].concat(_toConsumableArray(args)));
      return promise.then(resolver);
    }
  }], [{
    key: "create",
    value: function create(thing) {
      return new FunctionTask(thing);
    }
  }]);

  return FunctionTask;
})(Task);

exports.FunctionTask = FunctionTask;

var SequenceTask = (function (_Task2) {
  _inherits(SequenceTask, _Task2);

  function SequenceTask(tasks) {
    _classCallCheck(this, SequenceTask);

    _get(Object.getPrototypeOf(SequenceTask.prototype), "constructor", this).call(this);
    if (!tasks || !tasks[Symbol.iterator]) {
      throw new TypeError(tasks + " is not iterable");
    }
    this.tasks = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var thing = _step.value;

        this.tasks.push(ensureTask.call(thing, this));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  _createClass(SequenceTask, [{
    key: "runWithContext",
    value: (function (_runWithContext) {
      function runWithContext(_x) {
        return _runWithContext.apply(this, arguments);
      }

      runWithContext.toString = function () {
        return _runWithContext.toString();
      };

      return runWithContext;
    })(function (context) {
      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      var resolver = taskPrepareContext(context, this);
      var promise = Promise.resolve();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop = function () {
          var thing = _step2.value;

          promise = promise.then(function (value) {
            return runWithContext.call.apply(runWithContext, [thing, context].concat(_toConsumableArray(args)));
          });
        };

        for (var _iterator2 = this.tasks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return promise.then(resolver);
    })
  }], [{
    key: "create",
    value: function create(thing) {
      return new SequenceTask(thing);
    }
  }]);

  return SequenceTask;
})(Task);

exports.SequenceTask = SequenceTask;

var SetTask = (function (_Task3) {
  _inherits(SetTask, _Task3);

  function SetTask(tasks) {
    _classCallCheck(this, SetTask);

    _get(Object.getPrototypeOf(SetTask.prototype), "constructor", this).call(this);
    if (!tasks || !tasks[Symbol.iterator]) {
      throw new TypeError(tasks + " is not iterable!");
    }
    this.tasks = new Set();
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = tasks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var thing = _step3.value;

        this.tasks.add(ensureTask.call(thing, this));
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
          _iterator3["return"]();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  }

  _createClass(SetTask, [{
    key: "runWithContext",
    value: (function (_runWithContext2) {
      function runWithContext(_x2) {
        return _runWithContext2.apply(this, arguments);
      }

      runWithContext.toString = function () {
        return _runWithContext2.toString();
      };

      return runWithContext;
    })(function (context) {
      var resolver = taskPrepareContext(context, this);
      var promises = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
          args[_key5 - 1] = arguments[_key5];
        }

        for (var _iterator4 = this.tasks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var thing = _step4.value;

          var newContext = _context.TaskContext.from(context);
          promises.push(runWithContext.call.apply(runWithContext, [thing, newContext].concat(_toConsumableArray(args))));
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      return Promise.all(promises).then(resolver);
    })
  }], [{
    key: "create",
    value: function create(thing) {
      return new SetTask(thing);
    }
  }]);

  return SetTask;
})(Task);

exports.SetTask = SetTask;

function taskPrepareContext(context, task) {
  context.stack.push(task);
  var e = _context.TaskEvent.create("start", { context: context });
  context.stack.dispatchEvent(e);

  return function (value) {
    var e = _context.TaskEvent.create("finished", { context: context });
    context.stack.dispatchEvent(e);
    context.stack.pop();
    return value;
  };
}

function runWithContext(context) {
  var task = ensureTask.call(this, context);
  if (!task || !task.runWithContext) {
    throw new TypeError("Unable to run task " + task);
  }

  for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    args[_key6 - 1] = arguments[_key6];
  }

  return task.runWithContext.apply(task, [context].concat(_toConsumableArray(args)));
}

function ensureTask(parent) {
  if (!this) {
    throw new TypeError("Unable to create task from " + this);
  }
  if (this instanceof Task) {
    return this;
  }
  if (this instanceof Function) {
    return FunctionTask.create(this);
  }
  if (this instanceof Array) {
    var factory = SequenceTask;
    if (parent && parent.tasks instanceof Array) {
      factory = SetTask;
    }
    return factory.create(this);
  }
  if (this instanceof Set) {
    return SetTask.create(this);
  }
  throw new TypeError("Unable to create task from " + this);
}

function task(thing) {
  return Task.create(thing);
}

task.sequence = SequenceTask.create;
task.set = SetTask.create;

task.run = Task.run;