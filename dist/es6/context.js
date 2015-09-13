/*
 * natron-core
 */
"use strict";

import { Event } from "yaee";

class TaskContext {

  constructor({ args, stack }) {
    this.args = args || [];
    this.stack = stack instanceof TaskStack ? stack : TaskStack.create(stack);
  }

  static create({ args, stack }) {
    return new TaskContext({ args, stack });
  }

  static from(c) {
    let stack = TaskStack.from(c.stack);
    return TaskContext.create({ args: c.args, stack });
  }
}

export { TaskContext };

class TaskStack {

  constructor(stack) {
    if (!(stack instanceof Array)) {
      stack = stack && [stack] || [];
    }
    this.stack = stack;
  }

  push(t) {
    this.stack.push(t);
    return t;
  }

  pop() {
    return this.stack.pop();
  }

  get first() {
    return this.stack[0];
  }

  get last() {
    return this.stack[this.stack.length - 1];
  }

  dispatchEvent(e) {
    for (let i = this.stack.length - 1; i > -1; i--) {
      let task = this.stack[i];
      if (task.dispatchEvent) {
        task.dispatchEvent(e);
      }
    }
  }

  static create(stack) {
    return new TaskStack(stack);
  }

  static from(s) {
    return TaskStack.create(s && s.stack.slice());
  }
}

export { TaskStack };

class TaskEvent extends Event {

  constructor(type, init) {
    super(type, init);
    this.context = init && init.context;
  }

  static create(type, { context }) {
    return new TaskEvent(type, { context });
  }
}

export { TaskEvent };