// import parser from "yargs-parser";
import { ClassStruct, Container } from "./Core";

export abstract class CommandStruct {
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
    // this.commandRegistry.set(command.constructor.name, command);
    Commands.forEach((Command) => {
      // this.commandRegistry.set(Command.name, new Command());
    });
  }

  private initialize(Commands: ClassStruct[]) {
    // 拿到注册的所有命令
    Commands.forEach((Command) => {
      console.log(Command.name);
    });

    // 首先确定本次要被加载的命令
    const CommandToLoad = Commands.map((Command) =>
      Container.commandRegistry.get(Command.name)
    );

    // 然后将这些命令注册到命令注册表中
    CommandToLoad.forEach((Command) => {
      this.commandRegistry.set(Command.commandName, Command);
    });

    // console.log("CommandToLoad: ", CommandToLoad);

    // 解析这些命令及其内部声明的选项
  }

  private dispatchCommand(command: string, args: string[]) {
    const Command = this.commandRegistry.get(command).class;

    // 在这一步应当完成对所有内部选项值的填充
    const handler = new Command();

    handler.dry = true;

    // 执行命令
    handler.run();
  }

  public init() {
    const args = process.argv.slice(2);
    const [command, ...commandArgs] = args;
    this.dispatchCommand(command, commandArgs);
  }
}
