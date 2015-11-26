"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskSet = undefined;

var _task = require("../task");

var _context = require("../context");

var _task2 = require("../helper/task");

var _mapping = require("../helper/mapping");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module natron-core
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var TaskSet = exports.TaskSet = (function (_Task) {
  _inherits(TaskSet, _Task);

  function TaskSet(things, meta) {
    _classCallCheck(this, TaskSet);

    if (things && !things[Symbol.iterator]) {
      throw new TypeError(things + " is not iterable");
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TaskSet).call(this, meta || things && things.meta));

    _this.__set__ = new Set();

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

  _createClass(TaskSet, [{
    key: "runWithContext",
    value: function runWithContext(c) {
      var _this2 = this;

      var context = _context.TaskContext.create(c, this.args && {
        args: this.args
      });

      var _prepare = this.prepare(context);

      var start = _prepare.start;
      var finish = _prepare.finish;

      return start().then(function () {
        var promises = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = _this2.__set__[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var task = _step2.value;

            var context_ = context.clone({ stack: true });
            promises.push(task.runWithContext(context_));
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

        return Promise.all(promises);
      }).then(finish);
    }
  }, {
    key: "clone",
    value: function clone(init, deep) {
      var task = _get(Object.getPrototypeOf(TaskSet.prototype), "clone", this).call(this, init, deep);
      if (deep) {
        task.__set__ = new Set(this.__set__);
        _mapping.TaskMapping.clone(this.__set__, task.__set__);
      }
      return task;
    }
  }, {
    key: "add",
    value: function add(thing) {
      var task = undefined;
      if (thing instanceof _task.Task) {
        task = thing;
      } else {
        task = _mapping.TaskMapping.get(this.__set__, thing);
        if (!task) {
          task = (0, _task2.task)(thing);
          _mapping.TaskMapping.set(this.__set__, thing, task);
        }
      }
      this.__set__.add(task);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.__set__.clear();
      _mapping.TaskMapping.clear(this.__set__);
    }
  }, {
    key: "delete",
    value: function _delete(thing) {
      var task = undefined;
      if (thing instanceof _task.Task) {
        task = thing;
      } else {
        task = _mapping.TaskMapping.get(this.__set__, thing);
      }
      return this.__set__.delete(task);
    }
  }, {
    key: "has",
    value: function has(thing) {
      var task = undefined;
      if (thing instanceof _task.Task) {
        task = thing;
      } else {
        task = _mapping.TaskMapping.get(this.__set__, thing);
      }
      return this.__set__.has(task);
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
})(_task.Task);