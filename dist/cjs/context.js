"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @module natron-core
 */

var TaskContext = exports.TaskContext = (function () {
  _createClass(TaskContext, null, [{
    key: "create",
    value: function create(context) {
      if (context instanceof TaskContext) {
        return context;
      }
      return new TaskContext(context);
    }
  }]);

  function TaskContext(init) {
    _classCallCheck(this, TaskContext);

    if (init && init.stack && init.stack instanceof Array) {
      throw new TypeError(init.stack + " is not an array");
    }
    if (init && init.args && !(init.args instanceof Array)) {
      throw new TypeError(init.args + " is not an array");
    }
    _extends(this, init, init && {
      stack: init.stack || [],
      args: init.args || []
    });
  }

  _createClass(TaskContext, [{
    key: "clone",
    value: function clone(init) {
      var cxproto = Object.getPrototypeOf(this);
      var context = Object.create(cxproto);
      var init_ = { parent: this };
      if (init && init.stack === true) {
        init_.stack = this.stack.slice();
      }
      if (init && init.args === true) {
        init_.args = this.args.slice();
      }
      _extends(context, this, init, init_);
      return context;
    }
  }, {
    key: "publish",
    value: function publish(type, event) {
      if (this.eventAggregator) {
        var ea = this.eventAggregator;
        if (ea instanceof Function) {
          return ea(type, event);
        }
        var fn = ea.emit || ea.publish || ea.trigger;
        if (fn) {
          return fn.call(ea, type, event);
        }
      }
    }
  }, {
    key: "resolve",
    value: function resolve(name) {
      var task = undefined,
          depth = this.stack.length - 1;
      while (task = this.stack[depth--]) {
        if (task.resolver) {
          var rs = task.resolver;
          if (rs instanceof Function) {
            return rs(name, this);
          }
          var fn = rs.resolve;
          if (fn) {
            return fn.call(rs, name, this);
          }
          return;
        }
      }
    }
  }, {
    key: "rootTask",
    get: function get() {
      return this.stack[0];
    }
  }, {
    key: "currentTask",
    get: function get() {
      var depth = this.stack.length - 1;
      return this.stack[depth];
    }
  }]);

  return TaskContext;
})();