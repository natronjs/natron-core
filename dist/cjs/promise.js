"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callAndPromise = callAndPromise;
exports.streamToPromise = streamToPromise;
exports.childProcessToPromise = childProcessToPromise;
exports.emitWrapper = emitWrapper;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function callAndPromise(fn, self) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  if (this) {
    var _ref = [this, fn, [self].concat(_toConsumableArray(args))];
    fn = _ref[0];
    self = _ref[1];
    args = _ref[2];
  }
  try {
    var _fn;

    var result = (_fn = fn).call.apply(_fn, [self].concat(_toConsumableArray(args)));
    if (result && result.emit) {
      if (result.pipe) {
        return streamToPromise(result);
      }
      if (result.stdio) {
        return childProcessToPromise(result);
      }
    }
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
} /*
   * natron-core
   */

function streamToPromise(stream) {
  return new Promise(function (resolve, reject) {
    var reset = emitWrapper(stream, function (type) {
      switch (type) {
        case "end":
        case "finish":
          {
            return reset(resolve, { stream: stream });
          }
        case "error":
          {
            return reset(reject, arguments[1]);
          }
      }
    });
  });
}

function childProcessToPromise(child) {
  return new Promise(function (resolve, reject) {
    var reset = emitWrapper(child, function (type) {
      switch (type) {
        case "exit":
          {
            return reset(resolve, { child: child });
          }
        case "error":
          {
            return reset(reject, arguments[1]);
          }
      }
    });
  });
}

function emitWrapper(ee, fn) {
  var emit = ee.emit;
  ee.emit = function (type) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    fn.apply(undefined, [type].concat(_toConsumableArray(args)));
    return emit.call.apply(emit, [ee, type].concat(_toConsumableArray(args)));
  };
  return function (rr, value) {
    ee.emit = emit;
    return rr(value);
  };
}