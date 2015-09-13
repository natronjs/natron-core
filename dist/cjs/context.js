/*
 * natron-core
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _yaee = require("yaee");

var TaskContext = (function () {
  function TaskContext(_ref) {
    var args = _ref.args;
    var stack = _ref.stack;

    _classCallCheck(this, TaskContext);

    this.args = args || [];
    this.stack = stack instanceof TaskStack ? stack : TaskStack.create(stack);
  }

  _createClass(TaskContext, null, [{
    key: "create",
    value: function create(_ref2) {
      var args = _ref2.args;
      var stack = _ref2.stack;

      return new TaskContext({ args: args, stack: stack });
    }
  }, {
    key: "from",
    value: function from(c) {
      var stack = TaskStack.from(c.stack);
      return TaskContext.create({ args: c.args, stack: stack });
    }
  }]);

  return TaskContext;
})();

exports.TaskContext = TaskContext;

var TaskStack = (function () {
  function TaskStack(stack) {
    _classCallCheck(this, TaskStack);

    if (!(stack instanceof Array)) {
      stack = stack && [stack] || [];
    }
    this.stack = stack;
  }

  _createClass(TaskStack, [{
    key: "push",
    value: function push(t) {
      this.stack.push(t);
      return t;
    }
  }, {
    key: "pop",
    value: function pop() {
      return this.stack.pop();
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(e) {
      for (var i = this.stack.length - 1; i > -1; i--) {
        var task = this.stack[i];
        if (task.dispatchEvent) {
          task.dispatchEvent(e);
        }
      }
    }
  }, {
    key: "first",
    get: function get() {
      return this.stack[0];
    }
  }, {
    key: "last",
    get: function get() {
      return this.stack[this.stack.length - 1];
    }
  }], [{
    key: "create",
    value: function create(stack) {
      return new TaskStack(stack);
    }
  }, {
    key: "from",
    value: function from(s) {
      return TaskStack.create(s && s.stack.slice());
    }
  }]);

  return TaskStack;
})();

exports.TaskStack = TaskStack;

var TaskEvent = (function (_Event) {
  _inherits(TaskEvent, _Event);

  function TaskEvent(type, init) {
    _classCallCheck(this, TaskEvent);

    _get(Object.getPrototypeOf(TaskEvent.prototype), "constructor", this).call(this, type, init);
    this.context = init && init.context;
  }

  _createClass(TaskEvent, null, [{
    key: "create",
    value: function create(type, _ref3) {
      var context = _ref3.context;
      return (function () {
        return new TaskEvent(type, { context: context });
      })();
    }
  }]);

  return TaskEvent;
})(_yaee.Event);

exports.TaskEvent = TaskEvent;