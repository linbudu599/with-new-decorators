import { Command, Option, Options } from "./Impls/Decorators";
import { CLI, BaseCommand } from "./Impls/CommandLine";

@Command("run")
class HelloCommand extends BaseCommand {
  constructor() {
    super();
  }

  @Option("dry")
  public dry;

  public run(): void {
    console.log("Hello World! ", this.dry);
  }
}

const cli = new CLI("LinbuduLab CLI", [HelloCommand]);

// cli.registerCommand([HelloCommand]);

cli.init();
