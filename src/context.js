/*
 * natron-core
 */
import {Event} from "yaee";

interface TaskContextArgs {
  args?: Array<any>;
  stack?: TaskStack|Array<Task>|Task;
}

export class TaskContext {

  args: Array<any>;
  stack: TaskStack;

  constructor({args, stack}: TaskContextArgs) {
    this.args = args || [];
    this.stack = stack instanceof TaskStack ? stack : TaskStack.create(stack);
  }

  static create({args, stack}: TaskContextArgs): TaskContext {
    return new TaskContext({args, stack});
  }

  static from(c: TaskContext): TaskContext {
    let stack = TaskStack.from(c.stack);
    return TaskContext.create({args: c.args, stack});
  }
}

export class TaskStack {

  stack: Array<Task>;

  constructor(stack?: Array<Task>|Task) {
    if (!(stack instanceof Array)) {
      stack = stack && [stack] || [];
    }
    this.stack = stack;
  }

  push(t: Task): Task {
    this.stack.push(t);
    return t;
  }

  pop(): Task {
    return this.stack.pop();
  }

  get first(): Task {
    return this.stack[0];
  }

  get last(): Task {
    return this.stack[this.stack.length - 1];
  }

  dispatchEvent(e: TaskEvent): TaskStack {
    for (let i = this.stack.length - 1; i > -1; i--) {
      let task = this.stack[i];
      if (task.dispatchEvent) {
        task.dispatchEvent(e);
      }
    }
  }

  static create(stack?: Array<Task>|Task): TaskStack {
    return new TaskStack(stack);
  }

  static from(s: TaskStack): TaskStack {
    return TaskStack.create(s && s.stack.slice());
  }
}

export class TaskEvent extends Event {

  context: TaskContext;

  constructor(type: string, init: object) {
    super(type, init);
    this.context = init && init.context;
  }

  static create(type: string, {context}: {context: TaskContext}): TaskEvent {
    return new TaskEvent(type, {context});
  }
}
