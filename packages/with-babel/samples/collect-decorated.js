/// <reference path="../../../typing.d.ts" />
import assert from "assert";

const collection = {};

/** @type {Decorator} */
function CollectDecoratedMethod(self, { kind, name, addInitializer }) {
  addInitializer(function () {
    const className = this.constructor.name;
    if (!collection[className]) {
      collection[className] = new Set();
    }
    collection[className].add(name);
  });
}

class Collector {
  static #collections = new Set();

  /** @type {Decorator} */
  static Collect(self, { kind, name, addInitializer }) {
    kind === "class" &&
      addInitializer(function () {
        Collector.#collections.add(name);
      });
  }
}

class Foo {
  @CollectDecoratedMethod
  @Collector.Collect
  findMany() {}

  @CollectDecoratedMethod
  upsert() {}

  @CollectDecoratedMethod
  [Symbol.iterator]() {}
}

const foo = new Foo();

assert.deepEqual(
  collection.Foo,
  new Set(["findMany", "upsert", Symbol.iterator])
);
