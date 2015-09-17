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
### Example

```js
import {task} from "natron-core";

let clean = task((target, env) => {
  console.log("[>]", `Cleaning ${target} @ ${env}`);
  return working(() => {
    console.log("[<]", `Cleaning ${target} @ ${env}`);
  });
});

let build = task((target, env) => {
  console.log("[>]", `Building ${target} @ ${env}`);
  return working(() => {
    console.log("[<]", `Building ${target} @ ${env}`);
  });
});

let steps = task([clean, build]);

let builder = task.set([
  (env) => steps.run("A", env),
  (env) => steps.run("B", env),
]);

builder.run("production").then(() => {
  console.log("[#]", "Done");
});
```

```js
function working(fn) {
  return new Promise((r) => {
    setTimeout(() => r(fn()), Math.random() * 1e3);
  });
}
```

## API

### Task
#### Methods

```js
Task.prototype.run([...args: any]): Promise;
```

### _Functions_

```js
task(thing: Function|Array|Set|iterable): Task;
```

```js
task.sequence(thing: iterable): SequenceTask;
```

```js
task.set(thing: iterable): SetTask;
```

```js
task.run(thing: Task|Function|iterable): Promise;
```
