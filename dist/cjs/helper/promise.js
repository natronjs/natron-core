"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.promisify = promisify;
exports.defer = defer;
exports.callAndPromise = callAndPromise;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function promisify(value) {
  if (value && value.on) {
    if (value.pipe) {
      return promisifyStream(value);
    }
    if (value.stdio) {
      return promisifyChildProcess(value);
    }
  }
  // else if (value && value.subscribe) {
  //   return promisifyObservable(value);
  // }
  return Promise.resolve(value);
} /**
   * @module natron-core
   */

function promisifyStream(stream) {
  return new Promise(function (resolve, reject) {
    stream.on(stream._write ? "finish" : "end", function () {
      return resolve({ stream: stream });
    });
    stream.on("error", function (err) {
      return reject(err);
    });
  });
}

function promisifyChildProcess(child) {
  return new Promise(function (resolve, reject) {
    child.on("exit", function (code, signal) {
      return resolve({ child: child, code: code, signal: signal });
    });
    child.on("error", function (err) {
      return reject(err);
    });
  });
}

function defer() {
  var d = undefined,
      promise = new Promise(function (resolve, reject) {
    d = { promise: null, resolve: resolve, reject: reject };
  });
  d.promise = promise;
  return d;
}

function callAndPromise(fn, self) {
  try {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return promisify(fn.call.apply(fn, [self].concat(_toConsumableArray(args))));
  } catch (err) {
    return Promise.reject(err);
  }
}