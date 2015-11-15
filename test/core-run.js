/*
 * natron-core test
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
