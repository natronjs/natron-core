/**
 * @module natron-core
 */
import type {TaskContext} from "./context";
import type {Resolver, resolve} from "natron-core";

export class Task {

  options = {};
  name: string;

  resolver: Resolver|resolve;

  constructor(meta?: Object) {
    Object.assign(this, meta, meta && meta.options && {
      options: Object.assign(this.options, meta.options),
    });
  }

  run(...args): Promise {
    return this.runWithContext({args});
  }

  /**
   * @abstract
   */
  runWithContext(): Promise {
    throw new Error("Not implemented");
  }

  /**
   * @protected
   */
  prepare(context: TaskContext): Object {
    let e = {task: this, context};
    let start = () => {
      context.stack.push(this);
      context.publish("start", e);
      return Promise.resolve(e);
    };
    let finish = (value) => {
      e.value = value;
      context.publish("finish", e);
      context.stack.pop();
      return value;
    };
    return {start, finish, e};
  }
}
