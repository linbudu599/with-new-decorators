import { ScopeEnum } from "server-utils";

import type {
  AnyClassDecoratorReturnType,
  AnyClassFieldDecoratorReturnType,
  ClassStruct,
} from "./Typings";

const ClassRegistryMap = Map<string, ClassStruct<any>>;

const InstanceRegistryMap = Map<string, any>;

const ScopeMap = Map<unknown, ScopeEnum | undefined>;

export class Container {
  private static classMap = new ClassRegistryMap();

  private static instanceMap = new InstanceRegistryMap();

  private static scopeMap = new ScopeMap();

  public static Scope(scope: ScopeEnum): AnyClassDecoratorReturnType {
    return (Self, { kind, name }) => {
      Container.scopeMap.set(name, scope);
    };
  }

  public static Inject<T>(
    identifier: string
  ): AnyClassFieldDecoratorReturnType {
    return (_self, { kind, name }) => {
      return (_initialValue) => Container.produce(identifier ?? String(name));
    };
  }

  public static Provide(identifier?: string): AnyClassDecoratorReturnType {
    return (Self, { kind, name }) => {
      if (kind === "class") {
        // @ts-ignore
        Container.register(identifier ?? name, Self);
      }
    };
  }

  public static produceForFreshScope(identifier: string) {
    const Cls = Container.classMap.get(identifier);

    const instance = new Cls();

    return instance;
  }

  public static produceForSingletonScope(identifier: string) {
    if (Container.instanceMap.has(identifier)) {
      return Container.instanceMap.get(identifier);
    }

    const Cls = Container.classMap.get(identifier);

    const instance = new Cls();

    Container.instanceMap.set(identifier, instance);

    return instance;
  }

  public static produce<T extends any = any>(identifier: string): T {
    const scope = Container.scopeMap.get(identifier) ?? ScopeEnum.Singleton;

    return scope === ScopeEnum.Singleton
      ? Container.produceForSingletonScope(identifier)
      : Container.produceForFreshScope(identifier);
  }

  public static register(identifier: string, cls: ClassStruct): void {
    Container.classMap.set(identifier, cls);
  }
}
