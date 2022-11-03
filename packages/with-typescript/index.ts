/// <reference lib="decorators" />

function ClassDeco(): ClassDecoratorFunction {
  return (Target, context) => {
    context.addInitializer(() => {
      console.log("initializer");
    });
  };
}
@ClassDeco()
class Foo {}
