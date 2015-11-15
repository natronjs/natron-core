

export class TaskContext {

  constructor(init) {
    init = init || {};
    if (!init.stack) {
      init.stack = [];
    } else if (!(init.stack instanceof Array)) {
      throw new TypeError(`${ init.stack } is not an array`);
    }
    if (!init.args) {
      init.args = [];
    } else if (!(init.args instanceof Array)) {
      throw new TypeError(`${ init.args } is not an array`);
    }
    Object.assign(this, init);
  }

  get task() {
    return this.stack[this.stack.length - 1];
  }

  publish(type, e) {
    if (this.eventAggregator) {
      let ea = this.eventAggregator;
      if (ea instanceof Function) {
        return ea(type, e);
      }
      let fn = ea.emit || ea.publish || ea.trigger;
      if (fn) {
        return fn.call(ea, type, e);
      }
    }
  }

  clone(init) {
    let context = Object.create(TaskContext.prototype);
    init = init || {};
    if (init.stack === true) {
      init.stack = this.stack.slice();
    }
    if (init.args === true) {
      init.args = this.args.slice();
    }
    Object.assign(context, this, init);
    return context;
  }
} /*
   * natron-core
   */