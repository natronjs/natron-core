/**
 * @module natron-core
 */

export class Task {

  constructor(meta) {
    this.options = {};

    Object.assign(this, meta, meta && meta.options && {
      options: Object.assign(this.options, meta.options)
    });
  }

  run(...args) {
    return this.runWithContext({ args });
  }

  /**
   * @abstract
   */
  runWithContext() {
    throw new Error("Not implemented");
  }

  /**
   * @protected
   */
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