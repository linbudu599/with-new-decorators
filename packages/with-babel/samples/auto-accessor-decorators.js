/// <reference path="../../../typing.d.ts" />
import assert from "assert";

/**
 * Its associated decorators provide more comprehensive control
 * than property decorators,
 * i.e. they can only affect the values of initialized fields,
 * but can completely replace auto-accessors
 *
 * value === context.access
 * return an object with get & set defined to replace original auto-accessors
 * influence the value of initialized fields by return an object with additional init method
 */

const UninitializedFlag = Symbol("Uninitialized");

/** @type {ClassAutoAccessorDecorator} */
function Readonly({ get: rawGetter, set: rawSetter }, { kind, name }) {
  if (kind === "accessor") {
    return {
      init() {
        return UninitializedFlag;
      },
      get() {
        const result = rawGetter.call(this);
        if (result === UninitializedFlag) {
          throw new TypeError(`Accessor ${name} not initialized.`);
        }
        return result;
      },
      set(v) {
        const raw = rawGetter.call(this);
        if (raw !== UninitializedFlag) {
          throw new TypeError(`Accessor ${name} already initialized.`);
        }

        rawSetter.call(this, v);
      },
    };
  }
}

class Foo {
  @Readonly
  accessor readonlyProp;

  accessor mutableProp;

  constructor(init) {
    this.readonlyProp = init;
    this.mutableProp = init;
  }
}

const foo = new Foo("linbudu");

assert.equal(foo.mutableProp, "linbudu");
assert.equal(foo.readonlyProp, "linbudu");

assert.throws(() => {
  foo.readonlyProp = "updated";
}, /^TypeError: Accessor readonlyProp already initialized.$/);

assert.doesNotThrow(() => {
  foo.mutableProp = "updated";
});
