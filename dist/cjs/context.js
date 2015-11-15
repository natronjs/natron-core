"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TaskContext = exports.TaskContext = (function () {
  function TaskContext(init) {
    _classCallCheck(this, TaskContext);

    init = init || {};
    if (!init.stack) {
      init.stack = [];
    } else if (!(init.stack instanceof Array)) {
      throw new TypeError(init.stack + " is not an array");
    }
    if (!init.args) {
      init.args = [];
    } else if (!(init.args instanceof Array)) {
      throw new TypeError(init.args + " is not an array");
    }
    _extends(this, init);
  }

  _createClass(TaskContext, [{
    key: "publish",
    value: function publish(type, e) {
      if (this.eventAggregator) {
        var ea = this.eventAggregator;
        if (ea instanceof Function) {
          return ea(type, e);
        }
        var fn = ea.emit || ea.publish || ea.trigger;
        if (fn) {
          return fn.call(ea, type, e);
        }
      }
    }
  }, {
    key: "clone",
    value: function clone(init) {
      var context = Object.create(TaskContext.prototype);
      init = init || {};
      if (init.stack === true) {
        init.stack = this.stack.slice();
      }
      if (init.args === true) {
        init.args = this.args.slice();
      }
      _extends(context, this, init);
      return context;
    }
  }, {
    key: "task",
    get: function get() {
      return this.stack[this.stack.length - 1];
    }
  }]);

  return TaskContext;
})(); /*
       * natron-core
       */