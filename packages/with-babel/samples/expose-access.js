/// <reference path="../../../typing.d.ts" />
import assert from "assert";

let _access = null;

/** @type {Decorator} */
function ExposeAccess(self, { access }) {
  _access = access;
}

class Foo {
  @ExposeAccess
  name = "linbudu";
}

const foo = new Foo();

assert(foo, "linbudu");
assert(_access.get.call(foo), "linbudu");

_access.set.call(foo, "LINBUDU");

assert(foo, "LINBUDU");
assert(_access.get.call(foo), "LINBUDU");
