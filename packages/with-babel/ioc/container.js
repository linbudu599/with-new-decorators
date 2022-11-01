/// <reference path="../../../typing.d.ts" />

const ScopeEnum = {
  Request: "Request",
  Fresh: "Fresh",
};

export default class Container {
  static #classMap = new Map();

  static #instanceMap = new Map();

  /** @type {(identifier?: string) => ClassFieldDecorator} */
  static Inject(identifier) {
    return (_self, { kind, name }) => {
      if (kind === "field") {
        return (_initialValue) => {
          if (typeof _initialValue !== "undefined") {
            console.warn(
              `The decorated field ${name} has been initialized, the initial value will be overwritten.`
            );
          }
          return Container.produce(identifier ?? name);
        };
      }
    };
  }

  /** @type {(identifier?: string) => ClassDecorator} */
  static Provide(identifier) {
    return (Self, { kind, name }) => {
      if (kind === "class") {
        Container.register(identifier ?? name, Self);
      }
    };
  }

  /** @type {(scope: keyof typeof ScopeEnum) => ClassDecorator} */
  static Scope(scope) {}

  static produce(identifier) {
    if (Container.#instanceMap.has(identifier)) {
      return Container.#instanceMap.get(identifier);
    }

    const Cls = Container.#classMap.get(identifier);

    const instance = new Cls();

    Container.#instanceMap.set(identifier, instance);

    return instance;
  }

  static register(identifier, cls) {
    Container.#classMap.set(identifier, cls);
  }
}

export const { Provide, Inject, Scope } = Container;
