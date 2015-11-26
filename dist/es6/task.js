/**
 * @module natron-core
 */
import { mergeMeta } from "./helper/meta";

export class Task {

  constructor(meta) {
    Object.assign(this, mergeMeta({ options: {} }, meta));
  }

  run(...args) {
    return this.runWithContext({ args: this.args || args });
  }

  runWithContext(c) {
    throw new Error("Not implemented");
  }

  clone(init, deep) {
    let proto = Object.getPrototypeOf(this);
    let task_ = Object.create(proto);
    Object.assign(task_, this);
    if (init) {
      let init_ = mergeMeta({}, init);
      Object.assign(task_, init_);
    }
    return task_;
  }

  prepare(context) {
    let e = { task: this, context };
    let start = () => {
      context.stack.push(this);
      context.publish("start", e);
      return Promise.resolve(e);
    };
    let finish = value => {
      e.value = value;
      context.publish("finish", e);
      context.stack.pop();
      return value;
    };
    return { start, finish, e };
  }
}