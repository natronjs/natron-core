"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskSequence = undefined;

var _task = require("../task");

var _context = require("../context");

var _task2 = require("../helper/task");

var _mapping = require("../helper/mapping");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module natron-core
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var TaskSequence = exports.TaskSequence = (function (_Task) {
  _inherits(TaskSequence, _Task);

  function TaskSequence(things, meta) {
    _classCallCheck(this, TaskSequence);

    if (things && !things[Symbol.iterator]) {
      throw new TypeError(things + " is not iterable");
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TaskSequence).call(this, meta || things && things.meta));

    _this.__sequence__ = [];

    if (things) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = things[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var thing = _step.value;

          _this.add(thing);
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
    return _this;
  }

  _createClass(TaskSequence, [{
    key: "runWithContext",
    value: function runWithContext(c) {
      var _this2 = this;

      var context = _context.TaskContext.create(c, this.args && {
        args: this.args
      });

      var _prepare = this.prepare(context);

      var start = _prepare.start;
      var finish = _prepare.finish;

      var promise = start();
      if (this.__sequence__[0]) {
        (function () {
          var task = _this2.__sequence__[0];
          promise = promise.then(function () {
            return task.runWithContext(context);
          });
        })();
      }

      var result = [];

      var _loop = function _loop(i) {
        var task = _this2.__sequence__[i];
        promise = promise.then(function (value) {
          if (_this2.options.pipe) {
            var context_ = context.clone({ args: [value] });
            return task.runWithContext(context_);
          }
          result.push(value);
          return task.runWithContext(context);
        });
      };

      for (var i = 1; i < this.__sequence__.length; i++) {
        _loop(i);
      }

      if (!this.options.pipe) {
        promise = promise.then(function (value) {
          result.push(value);
          return result;
        });
      }
      return promise.then(finish);
    }
  }, {
    key: "add",
    value: function add(thing) {
      var task = undefined;
      if (thing instanceof _task.Task) {
        task = thing;
      } else {
        task = _mapping.TaskMapping.get(this.__sequence__, thing);
        if (!task) {
          task = (0, _task2.task)(thing);
          _mapping.TaskMapping.set(this.__sequence__, thing, task);
        }
      }
      this.__sequence__.push(task);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.__sequence__.length = 0;
      _mapping.TaskMapping.clear(this.__sequence__);
    }
  }, {
    key: "delete",
    value: function _delete(thing) {
      var task = undefined;
      if (thing instanceof _task.Task) {
        task = thing;
      } else {
        task = _mapping.TaskMapping.get(this.__sequence__, thing);
      }
      var index = this.__sequence__.indexOf(task);
      if (index !== -1) {
        this.__sequence__.splice(index, 1);
        return true;
      }
      return false;
    }
  }, {
    key: "has",
    value: function has(thing) {
      var task = undefined;
      if (thing instanceof _task.Task) {
        task = thing;
      } else {
        task = _mapping.TaskMapping.get(this.__sequence__, thing);
      }
      var index = this.__sequence__.indexOf(task);
      return index !== -1;
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
})(_task.Task);