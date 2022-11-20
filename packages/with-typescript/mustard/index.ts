import { Command, Option, Options } from "./Impls/Decorators";
import { CLI, BaseCommand, CommandStruct } from "./Impls/CommandLine";

@Command("run")
class RunCommand extends BaseCommand implements CommandStruct {
  constructor() {
    super();
  }

  example() {
    return `run xxx --dry`;
  }

  @Option("dry")
  public dry;

  public run(): void {
    console.log("Hello World! ", this.dry);
  }
}

@Command("check")
class CheckCommand extends BaseCommand {
  constructor() {
    super();
  }

  @Option("dry")
  public dry;

  public run(): void {
    console.log("Check Command! ", this.dry);
  }
}

const cli = new CLI("LinbuduLab CLI", [RunCommand]);

cli.registerCommand([CheckCommand]);

cli.init();
