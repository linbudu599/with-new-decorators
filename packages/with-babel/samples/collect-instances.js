/// <reference path="../../../typing.d.ts" />
import assert from "assert";

/** @type {Decorator} */
class InstanceCollector {
  static instances = new Set();

  /** @type {Decorator} */
  static CollectClassInstance(Self, { kind }) {
    if (kind === "class") {
      // preserve instantiation
      return function (...args) {
        const ins = new Self(...args);
        InstanceCollector.instances.add(ins);
        return ins;
      };

      // This fixs instanceof invoke
      // const NewClass = function (...args) {
      //   const ins = new Self(...args);
      //   InstanceCollector.instances.add(ins);
      //   return ins;
      // };

      // 1. Connect the prototype
      // NewClass.prototype = Self.prototype;

      // 2. Or we can deploy [Symbol.hasInstance] interface
      // Object.defineProperty(NewClass, Symbol.hasInstance, {
      //   value: function (x) {
      //     return x instanceof Self;
      //   },
      // });

      // 3. Return derived class

      // return NewClass;
    }
  }
}

@InstanceCollector.CollectClassInstance
class Foo {}

const foo1 = new Foo();
const foo2 = new Foo();
const foo3 = new Foo();

assert.deepEqual(InstanceCollector.instances, new Set([foo1, foo2, foo3]));

// This approach breaks instanceof relation
// To fix this we can assemble prototype chain to keep relation
assert.equal(foo1 instanceof Foo, false);
