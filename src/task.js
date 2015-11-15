/*
 * natron-core
 */
import {callAndPromise} from "./promise";
import {TaskContext} from "./context";

export class Task {

  options = {};

  name: string;
  description: string;

  constructor(meta?: object) {
    if (meta) {
      if (meta.options) {
        Object.assign(this.options, meta.options);
      }
      if (meta.name) {
        this.name = meta.name;
      }
      if (meta.description) {
        this.description = meta.description;
      }
    }
  }

  run(...args): Promise {
    return this.runWithContext({args});
  }
}

export class FunctionTask extends Task {

  __fn__: Function;

  constructor(fn: Function, meta?: object) {
    if (!(fn instanceof Function)) {
      throw new TypeError(`${fn} is not a function`);
    }
    meta = meta || fn.meta || {};
    if (!meta.name) {
      meta.name = fn.name;
    }
    super(meta);
    this.__fn__ = fn;
  }

  runWithContext(c: TaskContext): Promise {
    let {context, finisher, e} = prepareTask({task: this, context: c});
    let self = this.options.bind || context;
    return (callAndPromise(this.__fn__, self, ...context.args)
      .catch((err) => {
        e.error = err;
        context.publish("error", e);
        return Promise.reject(err);
      })
      .then(finisher)
    );
  }
}

export class TaskCollection extends Task {

  resolver: resolve|Resolver;

  constructor(meta?: object) {
    super(meta);
    if (meta && meta.resolver) {
      this.resolver = meta.resolver;
    }
  }
}

export class TaskSequence extends TaskCollection {

  __sequence__: Array<Task>;

  constructor(things: iterable<Thing>, meta?: object) {
    if (things && !things[Symbol.iterator]) {
      throw new TypeError(`${things} is not iterable`);
    }
    super(meta || things && things.meta);
    this.__sequence__ = [];
    if (things) {
      for (let thing of things) {
        this.add(thing);
      }
    }
  }

  runWithContext(c: TaskContext): Promise {
    let {context, finisher, result} = prepareTask({
      task: this, context: c,
      result: !this.options.pipe && [],
    });
    let promise = (this.__sequence__[0]
      ? this.__sequence__[0].runWithContext(context)
      : Promise.resolve()
    );
    for (let task, i = 1; i < this.__sequence__.length; i++) {
      task = this.__sequence__[i];
      promise = promise.then((value) => {
        if (this.options.pipe) {
          context = context.clone({args: [value]});
        } else {
          result.push(value);
        }
        return task.runWithContext(context);
      });
    }
    return promise.then(finisher);
  }

  get size(): number {
    return this.__sequence__.length;
  }

  add(thing: Thing): void {
    if (thing instanceof Task) {
      return this.__sequence__.push(thing);
    }
    if (!this.__sequence__.__map__) {
      this.__sequence__.__map__ = new Map();
    }
    let task = this.__sequence__.__map__.get(thing);
    if (!task) {
      task = ensureTask(thing);
      this.__sequence__.__map__.set(thing, task);
    }
    return this.__sequence__.push(task);
  }

  clear(): void {
    this.__sequence__.length = 0;
    if (this.__sequence__.__map__) {
      this.__sequence__.__map__.clear();
    }
  }

  [Symbol.iterator](): Iterator {
    return this.__sequence__[Symbol.iterator]();
  }
}

export class TaskSet extends TaskCollection {

  __set__: Set<Task>;

  constructor(things: iterable<Thing>, meta?: object) {
    if (things && !things[Symbol.iterator]) {
      throw new TypeError(`${things} is not iterable`);
    }
    super(meta || things && things.meta);
    this.__set__ = new Set();
    if (things) {
      for (let thing of things) {
        this.add(thing);
      }
    }
  }

  runWithContext(c: TaskContext): Promise {
    let {context, finisher} = prepareTask({task: this, context: c});
    let promises = [];
    for (let task of this.__set__) {
      let context_ = context.clone({stack: true});
      promises.push(task.runWithContext(context_));
    }
    return Promise.all(promises).then(finisher);
  }

  get size(): number {
    return this.__set__.size;
  }

  add(thing: Thing): void {
    if (thing instanceof Task) {
      return this.__set__.add(thing);
    }
    if (!this.__set__.__map__) {
      this.__set__.__map__ = new Map();
    }
    if (!this.__set__.__map__.has(thing)) {
      let task = ensureTask(thing);
      this.__set__.__map__.set(thing, task);
      return this.__set__.add(task);
    }
  }

  clear(): void {
    this.__set__.clear();
    if (this.__set__.__map__) {
      this.__set__.__map__.clear();
    }
  }

  delete(thing: Thing): boolean {
    if (!(thing instanceof Task) && this.__set__.__map__) {
      let task = this.__set__.__map__.get(thing);
      if (task) {
        this.__set__.__map__.delete(thing);
      }
      return this.__set__.delete(task);
    }
    return this.__set__.delete(thing);
  }

  has(thing: Thing): boolean {
    if (!(thing instanceof Task) && this.__set__.__map__) {
      return this.__set__.__map__.has(thing);
    }
    return this.__set__.has(thing);
  }

  [Symbol.iterator](): Iterator {
    return this.__set__[Symbol.iterator]();
  }
}

export class LazyTask extends Task {

  __ident__: string;

  constructor(ident: string, meta?: object) {
    if (typeof ident !== "string") {
      throw new TypeError(`${ident} is not a valid identifier`);
    }
    super(meta);
    this.__ident__ = ident;
  }

  runWithContext(c: TaskContext): Promise {
    throw new Error("Not yet implemented");
  }
}

function ensureTask(thing: Thing, meta?: object): Task {
  if (thing instanceof Task) {
    return thing;
  }
  if (thing instanceof Array) {
    let c = 1;
    for (let cur = thing; cur.length === 1; cur = cur[0], c++) {
      if (!(cur[0] instanceof Array) || cur[0].meta) {
        break;
      }
    }
    if (c % 2 === 0) {
      return new TaskSet(thing[0], meta);
    }
    return new TaskSequence(thing, meta);
  }
  if (thing instanceof Function) {
    return new FunctionTask(thing, meta);
  }
  if (thing instanceof Set) {
    return new TaskSet(thing, meta);
  }
  if (typeof thing === "string") {
    return new LazyTask(thing, meta);
  }
  throw new TypeError(`${thing} cannot be converted to task`);
}

function prepareTask({task, context, result}): object {
  if (!(context instanceof TaskContext)) {
    context = new TaskContext(context);
  }
  context.stack.push(task);
  let e = {task, context};
  context.publish("start", e);
  let finisher = (value) => {
    if (result) {
      result.push(value);
      value = result;
    }
    e.value = value;
    context.publish("finish", e);
    context.stack.pop();
    return value;
  };
  return {context, result, finisher, e};
}

export function task(thing: Thing, meta?: object): Task {
  return ensureTask(thing, meta);
}
