/**
 * @module natron-core
 */
import type {TaskContext} from "./context";

export type Thing = Task|Function|string|Iterable<Thing>;

type Resolver = {
  resolve: resolve;
};
type resolve = (name: string, context?: TaskContext) => Thing;

export class Task {

  options = {};
  name: string;

  resolver: Resolver|resolve;

  constructor(meta?: Object) {
    Object.assign(this, meta, meta && {
      options: Object.assign(this.options, meta.options),
    });
  }

  run(...args): Promise {
    return this.runWithContext({args});
  }

  runWithContext(c: TaskContext): Promise {
    throw new Error("Not implemented");
  }

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
