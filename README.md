# [![Natron][natron-img]][natron-url]

[natron-img]: http://static.natronjs.com/img/natronjs.svg
[natron-url]: http://natronjs.com/

**Tasks with Promises**

[![Version][npm-img]][npm-url]
[![Downloads][dlm-img]][npm-url]
[![Build Status][travis-img]][travis-url]

[![Gitter Chat][gitter-img]][gitter-url]

[npm-img]: https://img.shields.io/npm/v/natron-core.svg
[npm-url]: https://npmjs.org/package/natron-core
[dlm-img]: https://img.shields.io/npm/dm/natron-core.svg
[travis-img]: https://travis-ci.org/natronjs/natron-core.svg
[travis-url]: https://travis-ci.org/natronjs/natron-core
[gitter-img]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/natronjs/natron

This module is part of [Natron][natron-url] and contains the core functionality of the task runner.

## Usage

```js
import {task} from "natron-core";

let counterFn = (obj) => {
  console.log("Counter:", obj.c++);
  return obj;
};

let counterTask = task([
  counterFn,
  counterFn,
  counterFn,
]);

counterTask.run({c: 0}).then((obj) => {
  console.log("Result:", obj.c);
});
```

```sh
$ babel-node example
Counter: 0
Counter: 1
Counter: 2
Result: 3
```
