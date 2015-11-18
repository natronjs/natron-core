

export class TaskContext {

  static create(context) {
    if (context instanceof TaskContext) {
      return context;
    }
    return new TaskContext(context);
  }

  constructor(init) {
    if (init && init.stack && init.stack instanceof Array) {
      throw new TypeError(`${ init.stack } is not an array`);
    }
    if (init && init.args && !(init.args instanceof Array)) {
      throw new TypeError(`${ init.args } is not an array`);
    }
    Object.assign(this, init, init && {
      stack: init.stack || [],
      args: init.args || []
    });
  }

  get rootTask() {
    return this.stack[0];
  }

  get currentTask() {
    let depth = this.stack.length - 1;
    return this.stack[depth];
  }

  clone(init) {
    let cxproto = Object.getPrototypeOf(this);
    let context = Object.create(cxproto);
    let init_ = { parent: this };
    if (init && init.stack === true) {
      init_.stack = this.stack.slice();
    }
    if (init && init.args === true) {
      init_.args = this.args.slice();
    }
    Object.assign(context, this, init, init_);
    return context;
  }

  publish(type, event) {
    if (this.eventAggregator) {
      let ea = this.eventAggregator;
      if (ea instanceof Function) {
        return ea(type, event);
      }
      let fn = ea.emit || ea.publish || ea.trigger;
      if (fn) {
        return fn.call(ea, type, event);
      }
    }
  }

  resolve(name) {
    let task,
        depth = this.stack.length - 1;
    while (task = this.stack[depth--]) {
      if (task.resolver) {
        let rs = task.resolver;
        if (rs instanceof Function) {
          return rs(name, this);
        }
        let fn = rs.resolve;
        if (fn) {
          return fn.call(rs, name, this);
        }
        return;
      }
    }
  }
} /**
   * @module natron-core
   */