/*
 * natron-core test
 */
import {task, Task, FunctionTask, TaskSequence, TaskSet, LazyTask} from "../";

describe("task()", () => {

  function foo() {}
  function bar() {}

  it("FunctionTask", () => {
    let t = [];

    t.push(task(foo));
    t.push(task(t[0]));
    t.push(task(() => {}));
    t.push(task(function () {}));

    for (let i of t) {
      assert(i instanceof FunctionTask);
    }
  });

  it("TaskSequence", () => {
    let t = [];

    t.push(task([]));
    t.push(task(t[0]));
    t.push(task([[[]]]));
    t.push(task([foo]));
    t.push(task([foo, "bar"]));
    t.push(task([[foo], "bar"]));
    t.push(task(new Array()));
    t.push(task(new Array("foo", bar)));

    for (let i of t) {
      assert(i instanceof TaskSequence);
    }
  });

  it("TaskSet", () => {
    let t = [];

    t.push(task([[]]));
    t.push(task(t[0]));
    t.push(task([[[[]]]]));
    t.push(task([[foo]]));
    t.push(task([[foo, "bar"]]));
    t.push(task([[[foo], "bar"]]));
    t.push(task(new Set()));
    t.push(task(new Set(["foo", bar])));

    for (let i of t) {
      assert(i instanceof TaskSet);
    }
  });

  it("LazyTask", () => {
    let t = [];

    t.push(task("foo"));
    t.push(task(t[0]));
    t.push(task(foo + ""));

    for (let i of t) {
      assert(i instanceof LazyTask);
    }
  });

  describe("/deep/", () => {
    it("TaskSequence, TaskSet", () => {
      let a = [foo];
      let b = [bar];
      b.meta = {};

      let t = task([a, [a], [b], [[foo, bar]]]);
      assert(t instanceof TaskSequence);

      let arr = Array.from(t);
      assert(arr[0] instanceof TaskSequence);
      assert(arr[1] instanceof TaskSet);
      assert(arr[2] instanceof TaskSequence);
      assert(arr[3] instanceof TaskSet);
    });
  });
});
