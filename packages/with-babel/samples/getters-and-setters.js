/// <reference path="../../../typing.d.ts" />
import assert from "assert";

/** @type {Decorator} */
function Lazy(self, { kind, name, addInitializer }) {
  if (kind === "getter") {
    return function () {
      const result = self.call(this);
      // this.[name] will be immutable
      Object.defineProperty(this, name, {
        value: result,
        writable: false,
      });
      return result;
    };
  }
}

class Foo {
  @Lazy
  get computedProp1() {
    console.log("Evaluting Computed Prop1");
    return Math.random() > 0.5 ? "foo" : "bar";
  }

  get computedProp2() {
    console.log("Evaluting Computed Prop2");
    return Math.random() > 0.5 ? "foo" : "bar";
  }
}

const foo = new Foo();
console.log(foo.computedProp1);
console.log(foo.computedProp2);
