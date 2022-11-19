import { Container } from "container";
import type { FuncStruct, ClassStruct } from "./Typings";

enum RequestType {
  Get = "GET",
  Post = "POST",
}

type CollectedControllerInfo = {
  requestPath: string;
  requestMethod: RequestType;
  requestHandle: FuncStruct;
};

const MethodMap = Map<FuncStruct, RequestType>;
const PathMap = Map<FuncStruct, string>;
const ControllerMap = Map<ClassStruct, string>;

export class RouterCollector {
  private static controllerMap = new ControllerMap();
  private static methodMap = new MethodMap();
  private static pathMap = new PathMap();

  static RouteDecoratorFactory(
    method: RequestType
  ): (path: string) => ClassMethodDecoratorFunction {
    return (path) => {
      return (self, { kind, name }) => {
        if (kind === "method") {
          RouterCollector.pathMap.set(self, path);
          RouterCollector.methodMap.set(self, method);
        }
      };
    };
  }

  static Get(path: string): ClassMethodDecoratorFunction {
    return RouterCollector.RouteDecoratorFactory(RequestType.Get)(path);
  }

  static Post(path: string): ClassMethodDecoratorFunction {
    return RouterCollector.RouteDecoratorFactory(RequestType.Post)(path);
  }

  static Controller(path = ""): ClassDecoratorFunction {
    return (Self, { kind, name }) => {
      // @ts-expect-error
      RouterCollector.controllerMap.set(Self, path);
      // @ts-expect-error
      Container.register(name, Self);
    };
  }

  static collect(instance: unknown): CollectedControllerInfo[] {
    const proto = Object.getPrototypeOf(instance);

    const controllerAPIRootPath = RouterCollector.controllerMap.get(
      proto.constructor
    );

    const controllerMethods = Object.getOwnPropertyNames(proto).filter(
      (i) => i !== "constructor"
    );

    const impls = controllerMethods.map((methodName) => {
      const requestHandle: FuncStruct = proto[methodName];

      const requestMethod = RouterCollector.methodMap.get(requestHandle);

      const requestPath = `${controllerAPIRootPath}${RouterCollector.pathMap.get(
        requestHandle
      )}`;

      return {
        requestHandle,
        requestMethod,
        requestPath,
      };
    });

    return impls;
  }
}
