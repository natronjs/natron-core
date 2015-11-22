/**
 * @module natron-core
 * types
 */
import type {Task, TaskContext} from "natron-core";

export type Thing = Task|Function|string|Iterable<Thing>;

export type EventAggregator = {
  emit?: publish;
  publish?: publish;
  trigger?: publish;
};

export type Resolver = {
  resolve: resolve;
};

export type DeferredObject = {
  promise: Promise;
  resolve: Function;
  reject: Function;
};

export type publish = (type: string, e: any) => void;
export type resolve = (name: string, context?: TaskContext) => Thing;

declare module "natron-core" {

  declare class Task {
    run(...args: any): Promise;
    runWithContext(context: TaskContext): Promise;
  }

  declare class TaskContext {
    clone(init?: Object): TaskContext;
    publish(type: string, e: any): void;
    resolve(name: string): Thing;
  }
}
