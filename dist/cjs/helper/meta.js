"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeMeta = mergeMeta;
/**
 * @module natron-core
 */

function mergeMeta(meta, other) {
  if (other) {
    var meta_ = _extends({}, other);
    if (Object.hasOwnProperty(meta_, "options")) {
      meta_.options = Object(meta_.options);
      if (meta.options) {
        meta_.options = Object.assing(meta.options, meta_.options);
      }
    }
    if (meta_.args && !(meta_.args instanceof Array)) {
      throw new TypeError(meta_.args + " is not an array");
    }
    _extends(meta, meta_);
  }
  return meta;
}