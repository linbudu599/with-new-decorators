/// <reference path="../../typing.d.ts" />

/** @type {Decorator} */
function factory(self, context) {
  const { kind, name } = context;

  switch (kind) {
    case "class":
      console.log("Class Decorator Produced");
      return function (...args) {};
    case "method":
      console.log("Method Decorator Produced");
      return function (...args) {
        const res = self.call(this, ...args);
        return res;
      };
    case "field":
      console.log("Prop Decorator Produced");
      return function (...args) {};
    case "getter":
      console.log("Getter Decorator Produced");
      return function (...args) {};
    case "setter":
      console.log("Setter Decorator Produced");
      return function (...args) {};
    case "accessor":
      console.log("Accessor Decorator Produced");
      // accessor decorators must return an object with get, set, or init properties or void 0
      return {
        get: function (...args) {},
        set: function (...args) {},
      };
    default:
      break;
  }
}

@factory
class C {
  @factory
  prop = 1;

  @factory
  m(arg) {}

  @factory
  get prop() {}

  @factory
  set prop(value) {}

  @factory
  accessor _prop = false;
}
