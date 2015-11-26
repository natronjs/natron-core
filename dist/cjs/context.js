"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TaskContext = exports.TaskContext = (function () {
  _createClass(TaskContext, null, [{
    key: "create",
    value: function create(context, init) {
      if (context instanceof TaskContext) {
        return init ? context.clone(init) : context;
      }
      if (init) {
        context = _extends({}, context, init);
      }
      return new TaskContext(context);
    }
  }]);

  function TaskContext(init) {
    _classCallCheck(this, TaskContext);

    var init_ = init || {};
    if (!init_.stack) {
      init_.stack = [];
    } else if (!(init_.stack instanceof Array)) {
      throw new TypeError(init_.stack + " is not an array");
    }
    if (!init_.args) {
      init_.args = [];
    } else if (!(init_.args instanceof Array)) {
      throw new TypeError(init_.args + " is not an array");
    }
    _extends(this, init_);
  }

  _createClass(TaskContext, [{
    key: "clone",
    value: function clone(init) {
      var proto = Object.getPrototypeOf(this);
      var cntx_ = Object.create(proto);
      var init_ = {
        original: this
      };
      if (init) {
        init_ = _extends({}, init, init_);
        if (init_.stack === true) {
          init_.stack = this.stack.slice();
        }
        if (init_.args === true) {
          init_.args = this.args.slice();
        }
      }
      _extends(cntx_, this, init_);
      return cntx_;
    }
  }, {
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
    key: "resolve",
    value: function resolve(name) {
      var task = undefined,
          depth = this.depth;
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
          return null;
        }
      }
    }
  }, {
    key: "depth",
    get: function get() {
      return this.stack.length - 1;
    }
  }, {
    key: "root",
    get: function get() {
      return this.stack[0];
    }
  }, {
    key: "task",
    get: function get() {
      return this.stack[this.depth];
    }
  }]);

  return TaskContext;
})(); /**
       * @module natron-core
       */