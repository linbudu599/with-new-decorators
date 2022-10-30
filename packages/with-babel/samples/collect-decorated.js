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

class Foo {
  @CollectDecoratedMethod
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
