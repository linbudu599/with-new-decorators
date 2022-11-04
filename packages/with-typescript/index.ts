/// <reference lib="decorators" />
// Diretive above is not necessary, but you can read from its source to check type definitions for new decorators

function ClassDeco(): ClassDecoratorFunction {
  return (Target, context) => {
    context.addInitializer(() => {
      console.log("initializer!");
    });
  };
}
@ClassDeco()
class Foo {}
