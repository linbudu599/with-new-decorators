/// <reference path="../../../typing.d.ts" />
import assert from "assert";

/** @type {Decorator} */
function Enum(value, { kind, name }) {
  if (kind === "field") {
    return function (initialValue) {
      if (!Object.hasOwn(this, "EnumExports")) {
        this.EnumExports = new Map();
      }
      this.EnumExports.set(name, initialValue);

      initialValue.EnumValue = name;

      return initialValue;
    };
  }
}

class Color {
  @Enum static red = new Color();
  @Enum static green = new Color();
  @Enum static blue = new Color();

  toString() {
    return `Color(${this.EnumValue})`;
  }
}

assert.equal(Color.green.toString(), "Color(green)");
assert.deepEqual(
  Color.EnumExports,
  new Map([
    ["red", Color.red],
    ["green", Color.green],
    ["blue", Color.blue],
  ])
);
