/// <reference path="../../../typing.d.ts" />
import { inspect } from "util";

/** @type {Decorator} */
function LogBeforeAndAfter(self, context) {
  const { kind, name, addInitializer } = context;

  if (kind === "method") {
    return function (...args) {
      console.log(`Execute method ${name} with arguments ${args.join(", ")}`);
      const res = self.call(this, ...args);
      console.log(`Executed result: ${inspect(res)}`);
      return res;
    };
  }
}

/** @type {Decorator} */
function ModifyReturnValue(self, context) {
  const { kind, name, addInitializer } = context;

  if (kind === "method") {
    return function (...args) {
      const res = self.call(this, ...args);
      return res + ", Welcome!";
    };
  }
}

class Foo {
  @LogBeforeAndAfter
  @ModifyReturnValue
  static sayHi(name = "linbudu") {
    return `Hi, ${name}`;
  }
}

Foo.sayHi("Harold");

// OUTPUT
// Execute method sayHi with arguments Harold
// Executed result: 'Hi, Harold, Welcome!'
