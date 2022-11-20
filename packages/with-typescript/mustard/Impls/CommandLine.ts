// import parser from "yargs-parser";
import { ClassStruct, Container } from "./Core";

export abstract class CommandStruct {
  abstract example?: () => string;

  abstract run(): void;
}

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

export class CLI {
  public commandRegistry = new Map<string, any>();

  constructor(private readonly identifier: string, Commands: ClassStruct[]) {
    this.initialize(Commands);
    console.log(`CLI for ${identifier} initialized`);
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
      this.commandRegistry.set(Command.commandName, Command);
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

  private dispatchCommand(command: string, args: string[]) {
    const Command = this.commandRegistry.get(command).class;

    // 在这一步应当完成对所有内部选项值的填充
    const handler = new Command();

    // fork 下 yargs parser
    handler.dry = true;

    // 执行命令
    handler.run();
  }

  public init() {
    const args = process.argv.slice(2);
    const [command, ...commandArgs] = args;
    this.dispatchCommand(command, commandArgs);
  }

  public configure() {}
}
