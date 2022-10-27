/// <reference path="../../../typing.d.ts" />
import { setTimeout } from "timers/promises";

/** @type {Decorator} */
function ReplaceDecoratedClassWithAnother(Self, context) {
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

@ReplaceDecoratedClassWithAnother
class Foo {}

const foo = new Foo();

console.log(foo.derivedProp); // This is derived property

// OUTPUT:
// Extra initializer code executed.
// Instantiating an instance of derived class of Foo with arguments
// This is derived property
// --- after timeout ---
// Extra async initializer code executed.
