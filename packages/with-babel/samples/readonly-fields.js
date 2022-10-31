/// <reference path="../../../typing.d.ts" />
import assert from "assert";

const ReadOnlyFieldKeys = Symbol("ReadOnlyFieldKeys");

/** @type {Decorator} */
function Readonly(Self, { kind, name }) {
  if (kind === "field") {
    return function (v) {
      if (this[ReadOnlyFieldKeys] === undefined) {
        this[ReadOnlyFieldKeys] = new Set();
      }

      // Mark as readonly
      this[ReadOnlyFieldKeys].add(name);
    };
  }

  if (kind === "class") {
    return function (...args) {
      const inst = new Self(...args);
      for (const key of inst[ReadOnlyFieldKeys]) {
        Object.defineProperty(inst, key, { writable: false });
      }
      return inst;
    };
  }
}

@Readonly
class Foo {
  @Readonly
  name;

  constructor(name) {
    this.name = name;
  }
}

const foo = new Foo("linbudu");

assert.equal(foo.name, "linbudu");

assert.throws(
  () => (foo.name = "linbudu599"),
  /^TypeError: Cannot assign to read only property 'name'/
);
