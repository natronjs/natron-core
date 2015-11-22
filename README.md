# [![Natron][natron-img]][natron-url]

[natron-img]: http://static.natronjs.com/img/natronjs.svg
[natron-url]: http://natronjs.com/

**Tasks with Promises**

[![Version][npm-img]][npm-url]
[![Downloads][dlm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Readme][readme-img]][readme-url]

[![Gitter Chat][gitter-img]][gitter-url]

[npm-img]: https://img.shields.io/npm/v/natron-core.svg
[npm-url]: https://npmjs.org/package/natron-core
[dlm-img]: https://img.shields.io/npm/dm/natron-core.svg
[travis-img]: https://travis-ci.org/natronjs/natron-core.svg
[travis-url]: https://travis-ci.org/natronjs/natron-core
[readme-img]: https://img.shields.io/badge/read-me-orange.svg
[readme-url]: https://natron.readme.io/docs/module-natron-core

[gitter-img]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/natronjs/natron

This module is part of [Natron][natron-url] and contains the core functionality of the task runner.

## Documentation

See the [documentation for natron-core][readme-url].

## Usage

```js
import {task} from "natron-core";

function fn1()  { return 1; }
function fn2()  { return 2; }
function fnX(x) { return x; }

// => fn1(3) -> (fn2(3) || fnX(3))
(task([fn1, [[fn2, fnX]]]).run(3)
  .then((res) => {
    // res = [1, [2, 3]]
  })
  .catch((err) => {
    // handle error
  })
);
```
