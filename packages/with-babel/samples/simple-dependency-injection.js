/// <reference path="../../../typing.d.ts" />
import assert from "assert";

class Container {
  static #classMap = new Map();

  static #instanceMap = new Map();

  /** @type {Decorator} */
  static Inject(self, { kind, name }) {
    if (kind === "field") {
      return () => Container.produce(name);
    }
  }

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

class Logger {
  log(msg) {
    console.log("Logger", msg);
  }
}

class Foo {
  @Container.Inject
  logger;

  run() {
    this.logger.log("Linbudu");
  }
}

Container.register("logger", Logger);

new Foo().run();
