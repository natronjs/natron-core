/**
 * @module natron-core
 * test
 */
import {EventEmitter} from "events";
import {task, TaskContext} from "../";

describe("TaskContext", () => {

  function f(l) {
    return (v) => `<${v}<${l}>>`;
  }

  let a = f("a");
  let b = f("b");
  let c = f("c");

  it("Event on start and finish should be equal", () => {
    let ee = new EventEmitter();
    let mm = new WeakMap();
    let ec = 0;

    ee.on("start", (e) => {
      mm.set(e, true);
    });
    ee.on("finish", (e) => {
      assert.equal(mm.get(e), true);
      ec++;
    });

    let t = task([a, b, [[a, b, c]], b, a]);
    return (t.runWithContext({eventAggregator: ee})
      .then(() => assert.equal(ec, 9))
    );
  });

  it("Extend context with custom properties", () => {
    function g(v) {
      return this.data[v];
    }

    let t = task([g, g], {options: {pipe: true}});
    let c = {
      args: ["one"],
      data: {
        "one": "two",
        "two": "three",
      },
    };
    return assert.becomes(t.runWithContext(c), "three");
  });

  it("Event on error context inspection", () => {

    class MyTaskContext extends TaskContext {
      eventAggregator = new EventEmitter();
      pass = false;
      constructor(init) {
        super(init);
        this.eventAggregator.on("error", (e) => {
          if (!(e.context instanceof MyTaskContext)) {
            return;
          }
          let {stack, args} = e.context;
          if (stack.length !== 3) {
            return;
          }
          if (args[0] !== "<.<a>>") {
            return;
          }
          this.pass = true;
        });
      }
    }

    let context = new MyTaskContext({args: ["."]});
    let t = task([a, [[a, () => { throw new Error(); }, b]], b], {
      options: {pipe: true},
    });

    return assert.isRejected(t.runWithContext(context)
      .catch((err) => {
        return context.pass && Promise.reject(err);
      })
    );
  });
});
