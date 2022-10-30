/// <reference path="../../../typing.d.ts" />
import assert from "assert";

/**
 * Execution order of new decorators:
 *
 * - Evalution
 *   During class definition, the evaluation result must be a valid function
 *   And the result was stored in the temporary storage(binding to class?)
 *
 * - Invocation
 *   During class definition, after method members got evaluated, before assembtion of constructor and prototype
 *
 * - Application
 *   Instance of class got created, the result of invocation was applied to the instance
 *   This would affect the instance's prototype and constructor
 */

/** @type {DecoratorFactory} */
function Decorator(identifier) {
  console.log(`Decorator in ${identifier} Evaluated`);
  return (value, { kind, name, addInitializer }) => {
    console.log(`Decorator in ${identifier} Applied`);
    addInitializer?.(() => {
      console.log(`Decorator Initializer in ${identifier} Executed`);
    });
  };
}

function compute(id) {
  console.log(`Compute in ${id} Executed`);
  return id;
}

@Decorator("Class.Foo")
class Foo {
  @Decorator("Prop.name")
  name;

  @Decorator("Prop.age")
  age;

  @Decorator("Prop.staticProp")
  static staticProp = compute("computedStaticProp");

  @Decorator("Prop.multiA")
  @Decorator("Prop.multiB")
  multi;

  @Decorator("Method.call")
  call() {}

  @Decorator("Method.run")
  run() {}

  @Decorator("Method.computedMethod")
  [compute("computedMethod")]() {}
}

// OUTPUT
// Decorator in Class.Foo Evaluated
// Decorator in Prop.name Evaluated
// Decorator in Prop.age Evaluated
// Decorator in Prop.staticProp Evaluated
// Decorator in Prop.multiA Evaluated
// Decorator in Prop.multiB Evaluated
// Decorator in Method.call Evaluated
// Decorator in Method.run Evaluated
// Decorator in Method.computedMethod Evaluated
// Compute in computedMethod Executed
// Decorator in Method.call Applied
// Decorator in Method.run Applied
// Decorator in Method.computedMethod Applied
// Decorator in Prop.staticProp Applied
// Decorator in Prop.name Applied
// Decorator in Prop.age Applied
// Decorator in Prop.multiB Applied
// Decorator in Prop.multiA Applied
// Decorator in Class.Foo Applied
// Compute in computedStaticProp Executed
// Decorator Initializer in Class.Foo Executed
