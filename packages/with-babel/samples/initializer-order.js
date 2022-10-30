/// <reference path="../../../typing.d.ts" />
import assert from "assert";

/**
 * Initializer order of new decorators:
 *
 * - For class decoratoes, initializers are executed after the class definition got fully defined
 *   and all STATIC members were initialized
 *
 * - For NON STATIC class members, initializers are executed during member instantiation, and before instance members are initialized
 *
 *   So decorators can access this paramater, and initializers can be executed at the same time
 *   And, running decorator initializers before fields ensures that fields don’t see partially initialized methods.
 *
 * - For STATIC class members, initializers are executed during class definition, before static members are initialized and after NON STATIC elements are initialized
 *
 */

class Record {
  static records = [];

  static recordApplication(message) {
    Record.records.push(message);
  }

  static recordDefinition(message) {
    Record.records.push(message);
  }

  static recordInitializer(message, thisValue) {
    Record.records.push({
      message,
      thisValue,
    });
  }
}

/** @type {Decorator} */
function Init(self, { name, addInitializer }) {
  Record.recordApplication(`@Init applied in ${name}`);

  addInitializer?.(function () {
    Record.recordInitializer(`Initializer executed in ${name}`, this);
  });
}

class Foo {
  static {
    Record.recordDefinition("Static Block");
  }

  @Init
  static staticProp = Record.recordDefinition("StaticProp");

  @Init
  static staticMethod = Record.recordDefinition("StaticMethod");

  @Init
  static accessor staticAccessor = Record.recordDefinition("StaticAccessor");

  @Init
  insProp = Record.recordDefinition("InsProp");

  @Init
  insMethod = Record.recordDefinition("InsMethod");

  @Init
  accessor insAccessor = Record.recordDefinition("InsAccssor");

  constructor() {
    Record.recordDefinition("Constructor");
  }
}

Record.recordDefinition("=== Instantiation ===");

const foo = new Foo();

for (const step of Record.records) {
  if (typeof step === "string") {
    console.log(step);
    continue;
  }
  let thisDesc = "__";
  if (step.thisValue === Foo) {
    thisDesc = Foo.name;
  } else if (step.thisValue === foo) {
    thisDesc = "Instance";
  } else if (step.thisValue === undefined) {
    thisDesc = "Undefined";
  }

  console.log(`${step.msg} (this===${thisDesc})`);
}

// OUTPUT
// @Init applied in staticAccessor
// @Init applied in insAccessor
// @Init applied in staticProp
// @Init applied in staticMethod
// @Init applied in insProp
// @Init applied in insMethod
// undefined (this===Foo)
// Static Block
// StaticProp
// StaticMethod
// StaticAccessor
// === Instantiation ===
// undefined (this===Instance)
// InsProp
// InsMethod
// InsAccssor
// Constructor
