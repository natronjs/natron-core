/**
 * @module natron-core
 */
import type {TaskContext} from "./context";

export class Task {

  options = {};

  name: string;
  description: string;

  resolver: resolve|Resolver;

  constructor(meta?: object) {
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
  runWithContext(c: TaskContext): Promise {
    throw new Error("Not implemented");
  }

  /**
   * @protected
   */
  prepare(context: TaskContext): object {
    let event = {task: this, context};
    let start = () => {
      context.stack.push(this);
      context.publish("start", event);
      return Promise.resolve();
    };
    let finish = (value) => {
      event.value = value;
      context.publish("finish", event);
      context.stack.pop();
      return value;
    };
    return {start, finish, event};
  }
}
