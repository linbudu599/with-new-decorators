/// <reference path="../../../typing.d.ts" />

class MustardContainer {
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

  /** @type {(command: string) => ClassDecorator} */
  static Command(command) {
    return (Self, { kind, name }) => {
      if (kind === "class") {
      }
    };
  }

  /** @type {() => ClassFieldDecorator} */
  static Option() {
    return (self, { kind, name }) => {
      if (kind === "field") {
      }
    };
  }

  /** @type {() => ClassFieldDecorator} */
  static Options() {
    return (self, { kind, name }) => {
      if (kind === "field") {
      }
    };
  }

  /** @type {() => ClassFieldDecorator} */
  static Input() {
    return (self, { kind, name }) => {
      if (kind === "field") {
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

  static init(...commands) {}
}

class MustardCLI {
  static registerCommand(Cls) {}

  static initialize() {}
}

const { Command, Option, Options, Input } = MustardContainer;

@Command("run")
class RunCommand {
  @Options()
  collectedRunArgs;

  @Input()
  tailedInput;

  run(args) {
    console.log("run");
  }
}

class CleanCommand {}

class SyncCommand {}

MustardCLI.registerCommand(RunCommand);
MustardCLI.registerCommand(CleanCommand);
MustardCLI.registerCommand(SyncCommand);

MustardCLI.initialize();
