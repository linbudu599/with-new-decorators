/// <reference path="../../../typing.d.ts" />
import assert from "assert";

class Container {
  static #classMap = new Map();

  static #instanceMap = new Map();

  /** @type {(identifier?: string) => ClassFieldDecorator} */
  static Inject(identifier) {
    return (_self, { kind, name }) => {
      if (kind === "field") {
        return (_initialValue) => Container.produce(identifier ?? name);
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

const { Provide, Inject } = Container;

@Provide()
class LoggerService {
  log(msg) {
    console.log("---LoggerService---", msg);
  }
}

@Provide()
class UserService {
  query() {
    return {
      name: "linbudu",
      age: 18,
    };
  }
}

class UserModule {
  @Inject("LoggerService")
  logger;

  @Inject("UserService")
  userService;

  QueryUser() {
    const res = this.userService.query();
    this.logger.log("UserModule.QueryUser: " + JSON.stringify(res, null, 2));
    return res;
  }
}

assert.deepStrictEqual(new UserModule().QueryUser(), {
  name: "linbudu",
  age: 18,
});
