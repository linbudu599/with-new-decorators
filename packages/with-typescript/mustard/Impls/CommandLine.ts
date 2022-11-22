import parse from "yargs-parser";
import { ClassStruct, Container } from "./Core";

export abstract class CommandStruct {
  abstract example?: () => string;

  abstract run(): void;
}

type Dictionary<T = unknown> = Record<string, T>;

type PackageManagerUtils = {
  install: () => void;
  uninstall: () => void;
  update: () => void;
  getUsingPackageManager: () => void;
};

type JSONUtils = {
  readSync: () => void;
  read: () => Promise<void>;

  writeSync: () => void;
  write: () => Promise<void>;
};

type BuiltInUtils = {
  pm: PackageManagerUtils;
  json: JSONUtils;
};

export class BaseCommand {
  protected readonly utils: BuiltInUtils;
}

export interface ICLIConfiguration {
  enableUsage: boolean;
  enableVersion: boolean;

  debug: boolean;
}

export class CLI {
  public commandRegistry = new Map<string, any>();

  // only one key!
  public rootCommandRegistry = new Map<string, any>();

  constructor(
    private readonly identifier: string,
    Commands: ClassStruct[],
    private options?: ICLIConfiguration
  ) {
    this.initialize(Commands);
    // debug 模式
    console.log(`CLI for ${identifier} initialized`);
  }

  public configure(overrides: Partial<ICLIConfiguration>) {
    Object.assign(this.options ?? {}, overrides ?? {});
  }

  public registerCommand(Commands: ClassStruct[]) {
    this.internalRegisterCommand(Commands);
  }

  private internalRegisterCommand(Commands: ClassStruct[]) {
    const CommandToLoad = Commands.map((Command) =>
      Container.commandRegistry.get(Command.name)
    );

    // 然后将这些命令注册到命令注册表中
    CommandToLoad.forEach((Command) => {
      // 看起来需要多注册一个内部 Options
      Command.root
        ? this.rootCommandRegistry.set("root", Command)
        : this.commandRegistry.set(Command.commandName, Command);
    });
  }

  private initialize(Commands: ClassStruct[]) {
    // 拿到注册的所有命令
    Commands.forEach((Command) => {
      console.log(Command.name);
    });

    // 注册命令
    this.internalRegisterCommand(Commands);
    // 实例化 Parser
    // 初始化配置
    // 检查环境
  }

  private executeCommand(Command: any, args: Dictionary) {
    // 在这一步应当完成对所有内部选项值的填充
    const handler = new Command();

    const handlerOptions = Reflect.ownKeys(handler);

    // 更正确的应该是拿到内部所有被 Option / Options 装饰的属性进行处理
    // 以后再🔐！
    handlerOptions.forEach((optionKey) => {
      if (optionKey in args) {
        Reflect.set(handler, optionKey, args[optionKey as string]);
      }
    });

    // 执行命令
    handler.run();
  }

  private dispatchCommand(command: string[], args: Dictionary) {
    // todo: sub command
    const [main, ...subs] = command;

    const Command = this.commandRegistry.get(main).class;

    this.executeCommand(Command, args);
  }

  private useRootCommandIfSpecified(parsedArgs) {
    if (this.rootCommandRegistry.size > 0) {
      const RootCommand = this.rootCommandRegistry.get("root").class;
      this.executeCommand(RootCommand, parsedArgs);
    }
  }

  // 调用此方法后，再修改配置和添加命令将不会生效
  public start() {
    const args = process.argv.slice(2);
    const parsed = parse(args);
    console.log("11-22 parsed: ", parsed);

    const { _, ...parsedArgs } = parsed;

    if (_.length === 0) {
      // 如果指定了 RootCommand，则调用
      // 否则检查是否启用了 enableHelp
      // 如果都没有，NoRootHandlerError
      this.useRootCommandIfSpecified(parsedArgs);
      return;
    }

    this.dispatchCommand(_ as string[], parsedArgs);
  }
}
