/// <reference path="../../../typing.d.ts" />
import assert from "assert";

class Foo {
  accessor name = "linbudu";
}

const foo = new Foo();
assert.equal(foo.name, "linbudu");

foo.name = "linbudu599";
assert.equal(foo.name, "linbudu599");

// Roughly like this:
class _Foo {
  #name = "linbudu";

  get name() {
    return this.#name;
  }

  set name(v) {
    this.#name = v;
  }
}

class __Foo {
  static accessor myField1;
  static accessor #myField2;

  accessor myField3;
  accessor #myField4;

  static {
    // Static getter and setter
    assert.ok(Object.hasOwn(__Foo, "myField1"), "myField1");
    // Static getter and setter
    assert.ok(#myField2 in __Foo, "#myField2");

    // Prototype getter and setter
    assert.ok(Object.hasOwn(__Foo.prototype, "myField3"), "myField3");
    // Private getter and setter
    // (stored in instances, but shared between instances)
    assert.ok(#myField4 in new __Foo(), "#myField4");
  }
}
