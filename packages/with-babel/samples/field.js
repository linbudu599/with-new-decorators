/// <reference path="../../../typing.d.ts" />
import assert from "assert";

/**
 * Field decorator cannot change/replace original field(but we can use auto-accessor to do that).
 * We can change the field value by returning a function which accepts the original value and returns the new value.
 * Even private fields's access can be exposed by context.access.
 */

/** @type {Decorator} */
function Double() {
  return (v) => v * 2;
}

/** @type {Decorator} */
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
