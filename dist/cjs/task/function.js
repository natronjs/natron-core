"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunctionTask = undefined;

var _task = require("../task");

var _context = require("../context");

var _promise = require("../helper/promise");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module natron-core
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var FunctionTask = exports.FunctionTask = (function (_Task) {
  _inherits(FunctionTask, _Task);

  function FunctionTask(fn, meta) {
    _classCallCheck(this, FunctionTask);

    if (!(fn instanceof Function)) {
      throw new TypeError(fn + " is not a function");
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FunctionTask).call(this, _extends({ name: fn.name }, meta || fn.meta)));

    _this.__fn__ = fn;
    return _this;
  }

  /**
   * @override
   */

  /**
   * @private
   */

  _createClass(FunctionTask, [{
    key: "runWithContext",
    value: function runWithContext(c) {
      var _this2 = this;

      var context = _context.TaskContext.create(c);

      var _prepare = this.prepare(context);

      var start = _prepare.start;
      var finish = _prepare.finish;
      var event = _prepare.event;

      return start().then(function () {
        var args = context.args;

        var self = _this2.options.bind || context;
        return _promise.callAndPromise.apply(undefined, [_this2.__fn__, self].concat(_toConsumableArray(args)));
      }).catch(function (err) {
        event.error = err;
        context.publish("error", event);
        return Promise.reject(err);
      }).then(finish);
    }
  }]);

  return FunctionTask;
})(_task.Task);