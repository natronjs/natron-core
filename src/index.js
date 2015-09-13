/*
 * natron-core
 */
import assign from "object-assign";
import {EventEmitter} from "yaee";
import {TaskContext, TaskStack, TaskEvent} from "./context";
import {callWithPromise} from "./util";

export class Task extends EventEmitter {

  run(...args?: any): Promise {
    let context = TaskContext.create({args});
    return this.runWithContext(context, ...args);
  }

  static create(thing: Function|iterable<Task|Function>): Task {
    if (this !== Task) {
      return;
    }
    return thing::ensureTask(null);
  }

  static run(thing: Task|Function, ...args?: any): Promise {
    let context = TaskContext.create({args});
    return thing::runWithContext(context, ...args);
  }
}

export class FunctionTask extends Task {

  fn: Function;

  constructor(fn: Function) {
    super();
    if (!(fn instanceof Function)) {
      throw new TypeError(`${fn} is not a function`);
    }
    this.fn = fn;
  }

  runWithContext(context: TaskContext, ...args?: any): Promise {
    let resolver = taskPrepareContext(context, this);
    let promise = callWithPromise(this.fn, ...args);
    return promise.then(resolver);
  }

  static create(thing: Function): FunctionTask {
    return new FunctionTask(thing);
  }
}

export class SequenceTask extends Task {

  tasks: Array<Task>;

  constructor(tasks: iterable<Task|Function>) {
    super();
    if (!tasks || !tasks[Symbol.iterator]) {
      throw new TypeError(`${tasks} is not iterable`);
    }
    this.tasks = [];
    for (let thing of tasks) {
      this.tasks.push(thing::ensureTask(this));
    }
  }

  runWithContext(context: TaskContext, ...args?: any): Promise {
    let resolver = taskPrepareContext(context, this);
    let promise = Promise.resolve();
    for (let thing of this.tasks) {
      promise = promise.then((value: any) => {
        return thing::runWithContext(context, ...args);
      });
    }
    return promise.then(resolver);
  }

  static create(thing: iterable<Task|Function>): SequenceTask {
    return new SequenceTask(thing);
  }
}

export class SetTask extends Task {

  tasks: Set<Task>;

  constructor(tasks: iterable<Task|Function>) {
    super();
    if (!tasks || !tasks[Symbol.iterator]) {
      throw new TypeError(`${tasks} is not iterable!`);
    }
    this.tasks = new Set();
    for (let thing of tasks) {
      this.tasks.add(thing::ensureTask(this));
    }
  }

  runWithContext(context: TaskContext, ...args?: any): Promise {
    let resolver = taskPrepareContext(context, this);
    let promises = [];
    for (let thing of this.tasks) {
      let newContext = TaskContext.from(context);
      promises.push(thing::runWithContext(newContext, ...args));
    }
    return Promise.all(promises).then(resolver);
  }

  static create(thing: iterable<Task|Function>): SetTask {
    return new SetTask(thing);
  }
}

function taskPrepareContext(context: TaskContext, task: Task): Function {
  context.stack.push(task);
  let e = TaskEvent.create("start", {context});
  context.stack.dispatchEvent(e);

  return (value: any) => {
    let e = TaskEvent.create("finished", {context});
    context.stack.dispatchEvent(e);
    context.stack.pop();
    return value;
  };
}

function runWithContext(context: TaskContext, ...args?: any): Promise {
  let task = this::ensureTask(context);
  if (!task || !task.runWithContext) {
    throw new TypeError(`Unable to run task ${task}`);
  }
  return task.runWithContext(context, ...args);
}

function ensureTask(parent: Task): Task {
  if (!this) {
    throw new TypeError(`Unable to create task from ${this}`);
  }
  if (this instanceof Task) {
    return this;
  }
  if (this instanceof Function) {
    return FunctionTask.create(this);
  }
  if (this instanceof Array) {
    let factory = SequenceTask;
    if (parent && parent.tasks instanceof Array) {
      factory = SetTask;
    }
    return factory.create(this);
  }
  if (this instanceof Set) {
    return SetTask.create(this);
  }
  throw new TypeError(`Unable to create task from ${this}`);
}

export function task(thing: Function|iterable<Task|Function>): Task {
  return Task.create(thing);
}

task.sequence = SequenceTask.create;
task.set = SetTask.create;

task.run = Task.run;
