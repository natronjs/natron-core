/*
 * natron-core
 */
export {task, Task, FunctionTask, TaskSequence, TaskSet, LazyTask} from "./task";
export {TaskContext} from "./context";

export type Thing = Task|Function|string|iterable<Thing>;

declare module "natron-core" {

  declare function publish(type: string, e: any): void;

  declare class EventAggregator {
    publish?: publish;
    emit?: publish;
    trigger?: publish;
  }

  declare function resolve(name: string, context: TaskContext): Task;

  declare class Resolver {
    resolve: resolve;
  }
}
