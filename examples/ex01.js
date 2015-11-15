/*
 * natron-core examples
 */
import {EventEmitter} from "events";
import {task} from "../";

let ee = new EventEmitter();
let um = new WeakMap();
let uc = 0;

ee.on("start", (e) => {
  let name = e.task.name;
  if (!name) {
    name = `<task_${uc++}>`;
    um.set(e, name);
  }
  e.context.log(name, {prefix: "⇢"});
});

ee.on("finish", (e) => {
  let name = e.task.name;
  if (!name) {
    name = um.get(e);
  }
  e.context.log(name, {prefix: "⇠"});
});

function a(value) {
  this.log("value:", String(value));
  return `<${value}<a>>`;
}

function b(value) {
  this.log("value:", String(value));
  return `<${value}<b>>`;
}

let t = task([a, [[a, b]], b], {
  name: "ab-task",
  options: {pipe: true},
});

let context = {
  args: ["foo"],
  eventAggregator: ee,

  log(...args) {
    if (typeof args[args.length - 1] === "object") {
      let options = args.pop();
      if (options.prefix) {
        args.unshift(options.prefix);
      }
    } else {
      args.unshift(" ");
    }
    let len = this.stack.length - 1;
    if (len) {
      args.unshift(" ".repeat(len * 2 - 1));
    }
    return console.log(...args);
  },
};

(t.runWithContext(context)
  .then(value => {
    console.log("value:", String(value));
  })
);

// ⇢ ab-task
//   ⇢ a
//     value: foo
//   ⇠ a
//   ⇢ <task_0>
//     ⇢ a
//       value: <foo<a>>
//     ⇢ b
//       value: <foo<a>>
//     ⇠ a
//     ⇠ b
//   ⇠ <task_0>
//   ⇢ b
//     value: <<foo<a>><a>>,<<foo<a>><b>>
//   ⇠ b
// ⇠ ab-task
// value: <<<foo<a>><a>>,<<foo<a>><b>><b>>
