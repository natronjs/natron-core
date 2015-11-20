/**
 * @module natron-core
 */
import type {Task} from "./task";

export class TaskContext {

  stack: Array<Task>;
  args: Array<any>;

  parent: TaskContext;
  eventAggregator: publish|EventAggregator;

  static create(context?: TaskContext|Object): TaskContext {
    if (context instanceof TaskContext) {
      return context;
    }
    return new TaskContext(context);
  }

  constructor(init?: Object) {
    if (init && init.stack && (init.stack instanceof Array)) {
      throw new TypeError(`${init.stack} is not an array`);
    }
    if (init && init.args && !(init.args instanceof Array)) {
      throw new TypeError(`${init.args} is not an array`);
    }
    Object.assign(this, init, init && {
      stack: init.stack || [],
      args: init.args || [],
    });
  }

  get rootTask(): Task {
    return this.stack[0];
  }

  get currentTask(): Task {
    let depth = this.stack.length - 1;
    return this.stack[depth];
  }

  clone(init?: Object): TaskContext {
    let cxproto = Object.getPrototypeOf(this);
    let context = Object.create(cxproto);
    let init_ = {parent: this};
    if (init && init.stack === true) {
      init_.stack = this.stack.slice();
    }
    if (init && init.args === true) {
      init_.args = this.args.slice();
    }
    Object.assign(context, this, init, init_);
    return context;
  }

  publish(type: string, event: any): void {
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

  resolve(name: string): Task {
    let task, depth = this.stack.length - 1;
    while ((task = this.stack[depth--])) {
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
}
