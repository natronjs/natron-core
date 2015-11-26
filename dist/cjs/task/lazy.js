"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazyTask = undefined;

var _task = require("../task");

var _context = require("../context");

var _task2 = require("../helper/task");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module natron-core
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var LazyTask = exports.LazyTask = (function (_Task) {
  _inherits(LazyTask, _Task);

  function LazyTask(ident, meta) {
    _classCallCheck(this, LazyTask);

    if (typeof ident !== "string") {
      throw new TypeError(ident + " is not a valid identifier");
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LazyTask).call(this, meta));

    _this.__ident__ = ident;
    return _this;
  }

  _createClass(LazyTask, [{
    key: "runWithContext",
    value: function runWithContext(c) {
      var context = _context.TaskContext.create(c, this.args && {
        args: this.args
      });
      var thing = context.resolve(this.__ident__);
      if (thing) {
        var task = (0, _task2.task)(thing);
        return task.runWithContext(context);
      }
      throw new Error(this.__ident__ + " cannot be resolved");
    }
  }]);

  return LazyTask;
})(_task.Task);