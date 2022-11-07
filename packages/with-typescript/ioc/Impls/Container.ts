import type { ClassStruct } from "./Typings";

const ClassRegistryMap = Map<string, ClassStruct<any>>;

const InstanceRegistryMap = Map<string, any>;

export class Container {
  private static classMap = new ClassRegistryMap();

  private static instanceMap = new InstanceRegistryMap();

  static Inject<T>(identifier: string): ClassFieldDecoratorFunction {
    return (_self, { kind, name }) => {
      if (kind === "field") {
        return (_initialValue) => {
          if (typeof _initialValue !== "undefined") {
            console.warn(
              `The decorated field ${String(
                name
              )} has been initialized, the initial value will be overwritten.`
            );
          }
          return Container.produce(identifier ?? String(name));
        };
      }
    };
  }

  static Provide(identifier?: string): ClassDecoratorFunction {
    console.log("11-04 Provide identifier: ", identifier);
    return (Self, { kind, name }) => {
      if (kind === "class") {
        // @ts-expect-error
        Container.register(identifier ?? name, Self);
      }
    };
  }

  static produce<T extends any = any>(identifier: string): T {
    console.log("11-04 identifier: ", identifier);
    console.log(Container.classMap);
    console.log(Container.instanceMap);
    if (Container.instanceMap.has(identifier)) {
      return Container.instanceMap.get(identifier);
    }

    const Cls = Container.classMap.get(identifier);

    const instance = new Cls();

    Container.instanceMap.set(identifier, instance);

    return instance;
  }

  static register(identifier: string, cls: ClassStruct): void {
    Container.classMap.set(identifier, cls);
  }
}
