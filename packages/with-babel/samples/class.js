/// <reference path="../../../typing.d.ts" />
import { setTimeout } from "timers/promises";

/** @type {Decorator} */
function ReplaceDecoratedClassWithDerived(Self, context) {
  const { kind, name, addInitializer } = context;
  if (kind === "class") {
    addInitializer(() => {
      console.log("Extra initializer code executed.");
    });
    addInitializer(async () => {
      await setTimeout(1500);
      console.log("Extra async initializer code executed.");
    });
    return class extends Self {
      // Arguments when trying to instantiate original class
      constructor(...args) {
        super(...args);
        console.log(
          `Instantiating an instance of derived class of ${name} with arguments ${args.join(
            ", "
          )}`
        );
      }

      derivedProp = "This is derived property";
    };
  }
}

/** @type {Decorator} */
function ReplaceDecoratedClassWithAnother(Self, context) {
  const { kind, name, addInitializer } = context;
  if (kind === "class") {
    return class {
      // Arguments when trying to instantiate original class
      constructor(...args) {
        console.log(
          `Instantiating an instance of another class of ${name} with arguments ${args.join(
            ", "
          )}`
        );
      }

      anotherProp = "This is another property";
    };
  }
}

@ReplaceDecoratedClassWithDerived
class Foo {}

@ReplaceDecoratedClassWithAnother
class Bar {}

const foo = new Foo();
const bar = new Bar();

console.log(foo.derivedProp); // This is derived property
console.log(bar.anotherProp); // This is another property

// OUTPUT:
// Extra initializer code executed.
// Instantiating an instance of derived class of Foo with arguments
// Instantiating an instance of another class of Bar with arguments
// This is derived property
// This is another property
// --- after timeout ---
// Extra async initializer code executed.
