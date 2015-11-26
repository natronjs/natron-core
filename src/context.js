/**
 * @module natron-core
 */
import type {Thing, Task} from "./task";

type EventAggregator = {
  emit?: publish;
  publish?: publish;
  trigger?: publish;
}
type publish = (type: string, e: any) => void;

export class TaskContext {

  stack: Array<Task>;
  args: Array<any>;

  original: TaskContext;
  eventAggregator: EventAggregator|publish;

  static create(context?: TaskContext|Object, init?: Object): TaskContext {
    if (context instanceof TaskContext) {
      return init ? context.clone(init) : context;
    }
    if (init) {
      context = Object.assign({}, context, init);
    }
    return new TaskContext(context);
  }

  constructor(init?: Object) {
    let init_ = init || {};
    if (!init_.stack) {
      init_.stack = [];
    } else if (!(init_.stack instanceof Array)) {
      throw new TypeError(`${init_.stack} is not an array`);
    }
    if (!init_.args) {
      init_.args = [];
    } else if (!(init_.args instanceof Array)) {
      throw new TypeError(`${init_.args} is not an array`);
    }
    Object.assign(this, init_);
  }

  get depth(): number {
    return this.stack.length - 1;
  }

  get root(): Task {
    return this.stack[0];
  }

  get task(): Task {
    return this.stack[this.depth];
  }

  clone(init?: Object): TaskContext {
    let proto = Object.getPrototypeOf(this);
    let cntx_ = Object.create(proto);
    let init_ = {
      original: this,
    };
    if (init) {
      init_ = Object.assign({}, init, init_);
      if (init_.stack === true) {
        init_.stack = this.stack.slice();
      }
      if (init_.args === true) {
        init_.args = this.args.slice();
      }
    }
    Object.assign(cntx_, this, init_);
    return cntx_;
  }

  publish(type: string, e: any): void {
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

  resolve(name: string): Thing {
    let task, depth = this.depth;
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
        return null;
      }
    }
  }
}
