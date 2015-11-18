

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
  runWithContext(c) {
    throw new Error("Not implemented");
  }

  /**
   * @protected
   */
  prepare(context) {
    let event = { task: this, context };
    let start = () => {
      context.stack.push(this);
      context.publish("start", event);
      return Promise.resolve();
    };
    let finish = value => {
      event.value = value;
      context.publish("finish", event);
      context.stack.pop();
      return value;
    };
    return { start, finish, event };
  }
} /**
   * @module natron-core
   */