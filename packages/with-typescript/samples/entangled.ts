// Access class constructor in field decorator
// (Attach data to class constructor

function entangledFieldDecorator() {
  const fieldContextMap = new Map();

  return {
    Class(target: new (...args: any) => any, context: ClassDecoratorContext) {
      if (!fieldContextMap.size) throw new Error("Field not decorated");
    },
    Field(_: undefined, context: ClassFieldDecoratorContext) {
      fieldContextMap.set(context.name, context);
    },
  };
}

const Entangled = entangledFieldDecorator();

@Entangled.Class
class DecoTest {
  @Entangled.Field
  str?: string;
  num?: number;
}
