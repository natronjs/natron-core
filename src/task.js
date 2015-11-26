/**
 * @module natron-core
 */
import {mergeMeta} from "./helper/meta";
import type {TaskContext} from "./context";

export type Thing = Task|Function|string|Iterable<Thing>;

type Resolver = {
  resolve: resolve;
};
type resolve = (name: string, context?: TaskContext) => Thing;

export class Task {

  options: Object;
  name: string;
  args: Array<any>;

  resolver: Resolver|resolve;

  constructor(meta?: Object) {
    Object.assign(this, mergeMeta({options: {}}, meta));
  }

  run(...args): Promise {
    return this.runWithContext({args: this.args || args});
  }

  runWithContext(c: TaskContext): Promise {
    throw new Error("Not implemented");
  }

  clone(init?: Object, deep?: boolean): Task {
    let proto = Object.getPrototypeOf(this);
    let task_ = Object.create(proto);
    Object.assign(task_, this);
    if (init) {
      let init_ = mergeMeta({}, init);
      Object.assign(task_, init_);
    }
    return task_;
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
