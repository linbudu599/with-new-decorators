import { Command, RootCommand, Option, Options } from "./Impls/Decorators";
import { CLI, BaseCommand, CommandStruct } from "./Impls/CommandLine";
import { Validator } from "./Impls/Validator";

@Command("sync")
class RunSyncCommand extends BaseCommand implements CommandStruct {
  constructor() {
    super();
  }

  @Option("dry", Validator.Required().String().MinLength(3).MaxLength(5))
  public dryOption;

  public run(): void {
    console.log("Nested! ", this.dryOption);
  }
}

@Command("run")
class RunCommand extends BaseCommand implements CommandStruct {
  constructor() {
    super();
  }

  example() {
    return `run xxx --dry`;
  }

  @Option("dry", Validator.Required().String().MinLength(3).MaxLength(5))
  public dryOption;

  @Options()
  public allOptions;

  public run(): void {
    console.log("Hello World! ", this.dryOption);
    console.log("All Options! ", this.allOptions);
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

@RootCommand()
class RootCommandHandle extends BaseCommand {
  constructor() {
    super();
  }

  @Option("dry")
  public dry;

  public run(): void {
    console.log("Root Command! ", this.dry);
  }
}

const cli = new CLI("LinbuduLab CLI", [RootCommandHandle, RunCommand]);

cli.registerCommand([CheckCommand]);

cli.start();

cli.configure({});

/**
 * - alias support
 * - nested commands support
 * - collect commands info for usage generation
 * - validator related
 */
