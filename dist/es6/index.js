/*
 * natron-core
 */
"use strict";

export { task };
import assign from "object-assign";
import { EventEmitter } from "yaee";
import { TaskContext, TaskStack, TaskEvent } from "./context";
import { callWithPromise } from "./util";

class Task extends EventEmitter {

  run(...args) {
    let context = TaskContext.create({ args });
    return this.runWithContext(context, ...args);
  }

  static create(thing) {
    if (this !== Task) {
      return;
    }
    return ensureTask.call(thing, null);
  }

  static run(thing, ...args) {
    let context = TaskContext.create({ args });
    return runWithContext.call(thing, context, ...args);
  }
}

export { Task };

class FunctionTask extends Task {

  constructor(fn) {
    super();
    if (!(fn instanceof Function)) {
      throw new TypeError(`${ fn } is not a function`);
    }
    this.fn = fn;
  }

  runWithContext(context, ...args) {
    let resolver = taskPrepareContext(context, this);
    let promise = callWithPromise(this.fn, ...args);
    return promise.then(resolver);
  }

  static create(thing) {
    return new FunctionTask(thing);
  }
}

export { FunctionTask };

class SequenceTask extends Task {

  constructor(tasks) {
    super();
    if (!tasks || !tasks[Symbol.iterator]) {
      throw new TypeError(`${ tasks } is not iterable`);
    }
    this.tasks = [];
    for (let thing of tasks) {
      this.tasks.push(ensureTask.call(thing, this));
    }
  }

  runWithContext(context, ...args) {
    let resolver = taskPrepareContext(context, this);
    let promise = Promise.resolve();
    for (let thing of this.tasks) {
      promise = promise.then(value => {
        return runWithContext.call(thing, context, ...args);
      });
    }
    return promise.then(resolver);
  }

  static create(thing) {
    return new SequenceTask(thing);
  }
}

export { SequenceTask };

class SetTask extends Task {

  constructor(tasks) {
    super();
    if (!tasks || !tasks[Symbol.iterator]) {
      throw new TypeError(`${ tasks } is not iterable!`);
    }
    this.tasks = new Set();
    for (let thing of tasks) {
      this.tasks.add(ensureTask.call(thing, this));
    }
  }

  runWithContext(context, ...args) {
    let resolver = taskPrepareContext(context, this);
    let promises = [];
    for (let thing of this.tasks) {
      let newContext = TaskContext.from(context);
      promises.push(runWithContext.call(thing, newContext, ...args));
    }
    return Promise.all(promises).then(resolver);
  }

  static create(thing) {
    return new SetTask(thing);
  }
}

export { SetTask };

function taskPrepareContext(context, task) {
  context.stack.push(task);
  let e = TaskEvent.create("start", { context });
  context.stack.dispatchEvent(e);

  return value => {
    let e = TaskEvent.create("finished", { context });
    context.stack.dispatchEvent(e);
    context.stack.pop();
    return value;
  };
}

function runWithContext(context, ...args) {
  let task = ensureTask.call(this, context);
  if (!task || !task.runWithContext) {
    throw new TypeError(`Unable to run task ${ task }`);
  }
  return task.runWithContext(context, ...args);
}

function ensureTask(parent) {
  if (!this) {
    throw new TypeError(`Unable to create task from ${ this }`);
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
  throw new TypeError(`Unable to create task from ${ this }`);
}

function task(thing) {
  return Task.create(thing);
}

task.sequence = SequenceTask.create;
task.set = SetTask.create;

task.run = Task.run;