# [![natron-core][natron-img]][natron-url]
**Tasks with Promises.**

[![npm][npm-img]][npm-url] [![gitter][gitter-img]][gitter-url]

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

[natron-img]: http://static.natronjs.com/img/natronjs.svg
[natron-url]: http://natronjs.com
[npm-img]: http://img.shields.io/npm/v/natron-core.svg
[npm-url]: https://npmjs.org/package/natron-core
[gitter-img]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/natronjs/natron
