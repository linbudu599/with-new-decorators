/// <reference path="../../../typing.d.ts" />
import assert from "assert";

/** @type {Decorator} */
function BindMethod(self, { kind, name, addInitializer }) {
  if (kind === "method") {
    addInitializer(function () {
      this[name] = self.bind(this);
    });
  }
}

class Foo {
  #color;

  constructor(color) {
    this.#color = color;
  }

  @BindMethod
  boundMethod() {
    return `Color is ${this.#color}`;
  }

  unboundMethod() {
    return `Color is ${this.#color}`;
  }
}

const foo = new Foo("steelblue");

const { boundMethod, unboundMethod } = foo;

assert.equal(boundMethod(), "Color is steelblue");
assert.throws(
  () => unboundMethod(),
  /^TypeError: Cannot read properties of undefined/
);

assert.ok(Object.hasOwn(foo, "boundMethod"));
assert.ok(Object.hasOwn(foo, "unboundMethod"));

assert.notEqual(foo.boundMethod, Foo.prototype.boundMethod);
