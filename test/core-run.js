/**
 * @module natron-core
 * test
 */
import {task} from "../";

describe("run()", () => {

  function g(v) {
    return `<${v}>`;
  }

  function h(v) {
    return `[${v}]`;
  }

  describe("TaskFunction", () => {
    it("(a) => 'foo' + a", () => {
      let t = task((a) => "foo" + a);
      return assert.becomes(t.run("bar"), "foobar");
    });

    it("(x, y) => x + y", () => {
      let t = task((x, y) => x + y);
      return assert.becomes(t.run(2, 3), 5);
    });

    it("(a, b, c) => a + b + c", () => {
      let t = task((x, y) => x + y);
      let u = task((a, b, c) => {
        let x = a + b;
        return t.run(x, c);
      });
      return assert.becomes(u.run(2, 3, 5), 10);
    });

    it("Bind this object", () => {
      let t = task(function () {
        return this;
      }, {
        options: {
          bind: "self",
        },
      });
      return assert.becomes(t.run(), "self");
    });

    it("Bind args", () => {
      let t = task((x, y) => x + y, {
        args: [2, 3],
      });
      return assert.becomes(t.run(), 5);
    });

    it("Inject context", () => {
      let t = task(function (c) {
        return c.args;
      }, {
        args: [1, 2, 3],
        options: {
          injectContext: true,
        },
      });
      return assert.becomes(t.run(4, 5, 6), [1, 2, 3]);
    });

    it("Clone (args = null)", () => {
      let t = task(function (v) {
        return v;
      }, {
        args: [1],
      });
      let u = task(t, {
        args: null,
      });

      return assert.becomes(u.run(2), 2);
    });
  });

  describe("TaskSequence", () => {
    it("[g, g, g]", () => {
      let t = task([g, g, g]);
      return assert.becomes(t.run("."), ["<.>", "<.>", "<.>"]);
    });

    it("[g, g, g] (options.pipe = true)", () => {
      let t = task([g, g, g], {options: {pipe: true}});
      return assert.becomes(t.run("."), "<<<.>>>");
    });
  });

  describe("TaskSet", () => {
    it("[[g, g, g]]", () => {
      let t = task([[g, g, g]]);
      return assert.becomes(t.run("."), ["<.>"]);
    });

    it("[[g, g, h, h]]", () => {
      let t = task([[g, g, h, h]]);
      return assert.becomes(t.run("."), ["<.>", "[.]"]);
    });

    it("[[g, task(g), task(g)]]", () => {
      let t = task([[g, task(g), task(g)]]);
      return assert.becomes(t.run("."), ["<.>", "<.>", "<.>"]);
    });
  });
});
