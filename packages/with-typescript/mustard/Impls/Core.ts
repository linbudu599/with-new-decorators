export type FuncStruct<
  TArgs extends unknown[] = unknown[],
  TReturnType extends unknown = unknown
> = (...args: TArgs) => Promise<TReturnType>;

export type ClassStruct<TInstanceType extends unknown = unknown> = new (
  ...args: any[]
) => TInstanceType;

const CommandRrgistry = Map<
  string,
  {
    commandName: string;
    class: any;
  }
>;

const ClassRegistryMap = Map<string, ClassStruct<any>>;
const InstanceRegistryMap = Map<string, any>;

export class Container {
  public static classMap = new ClassRegistryMap();

  public static instanceMap = new InstanceRegistryMap();

  public static commandRegistry = new CommandRrgistry();

  public static optionRegistry = new CommandRrgistry();

  public static Command(commandName: string): ClassDecoratorFunction {
    return (target, context) => {
      // @ts-ignore
      Container.commandRegistry.set(context.name, {
        commandName,
        class: target,
      });
    };
  }

  public static Option(optionName: string): ClassFieldDecoratorFunction {
    return () => {};
  }

  public static Options(): ClassFieldDecoratorFunction {
    return () => {};
  }

  public static register(identifier: string, cls: ClassStruct): void {
    Container.classMap.set(identifier, cls);
  }

  public static collect(instance: unknown) {}

  // produceForFreshScope
  public static produce<T extends any = any>(identifier: string): T {
    const Cls = Container.classMap.get(identifier);

    const instance = new Cls();

    return instance;
  }
}
