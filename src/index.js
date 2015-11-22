/**
 * @module natron-core
 */
export {task} from "./helper/task";
export {Task} from "./task";
export {TaskContext} from "./context";
export {FunctionTask} from "./task/function";
export {LazyTask} from "./task/lazy";
export {TaskSequence} from "./task/sequence";
export {TaskSet} from "./task/set";

import type {Task} from "./task";
export type Thing = Task|Function|string|Iterable<Thing>;

declare module "natron-core" {

  declare function publish(type: string, event: any): void;

  declare class EventAggregator {
    publish?: publish;
    emit?: publish;
    trigger?: publish;
  }

  declare function resolve(name: string, context?: TaskContext): Thing;

  declare class Resolver {
    resolve: resolve;
  }
}
