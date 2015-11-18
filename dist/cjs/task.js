"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = exports.Task = (function () {
  function Task(meta) {
    _classCallCheck(this, Task);

    this.options = {};

    _extends(this, meta, meta && meta.options && {
      options: _extends(this.options, meta.options)
    });
  }

  _createClass(Task, [{
    key: "run",
    value: function run() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.runWithContext({ args: args });
    }

    /**
     * @abstract
     */

  }, {
    key: "runWithContext",
    value: function runWithContext(c) {
      throw new Error("Not implemented");
    }

    /**
     * @protected
     */

  }, {
    key: "prepare",
    value: function prepare(context) {
      var _this = this;

      var event = { task: this, context: context };
      var start = function start() {
        context.stack.push(_this);
        context.publish("start", event);
        return Promise.resolve();
      };
      var finish = function finish(value) {
        event.value = value;
        context.publish("finish", event);
        context.stack.pop();
        return value;
      };
      return { start: start, finish: finish, event: event };
    }
  }]);

  return Task;
})(); /**
       * @module natron-core
       */