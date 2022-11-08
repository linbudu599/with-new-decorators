import assert from "assert";

/** @type {ClassFieldDecoratorFunction} */
function Double() {
  return (v) => v * 2;
}

/** @type {ClassFieldDecoratorFunction} */
function Init() {
  return (v) => 1000;
}

class Foo {
  @Double
  count = 599;

  @Init
  init;
}

assert.equal(new Foo().count, 1198);
assert.equal(new Foo().init, 1000);
