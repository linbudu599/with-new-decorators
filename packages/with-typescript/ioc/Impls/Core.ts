import { Container } from "container";
import type { IncomingMessage, ServerResponse } from "http";
import type {
  FuncStruct,
  ClassStruct,
  MiddlewareStruct,
  AnyMethodClassDecoratorReturnType,
  AnyClassDecoratorReturnType,
} from "./Typings";

enum RequestType {
  Get = "GET",
  Post = "POST",
}

type CollectedControllerInfo = {
  requestPath: string;
  requestMethod: RequestType;
  requestHandle: FuncStruct<any>;
};

const MethodMap = Map<FuncStruct, RequestType>;
const PathMap = Map<FuncStruct, string>;
const MiddlewareMap = Map<FuncStruct, MiddlewareStruct[]>;
const ControllerMap = Map<ClassStruct, string>;

export class RouterCollector {
  private static controllerMap = new ControllerMap();
  private static methodMap = new MethodMap();
  private static pathMap = new PathMap();
  private static middlewareMap = new MiddlewareMap();

  public static RouteDecoratorFactory(
    method: RequestType
  ): (path: string) => AnyMethodClassDecoratorReturnType {
    return (path) => {
      return (self, { kind, name }) => {
        if (kind === "method") {
          RouterCollector.pathMap.set(self, path);
          RouterCollector.methodMap.set(self, method);
        }
      };
    };
  }

  /**
   * A really simple middleware registry, only executed after original request handle returned
   */
  public static Middleware(
    mws: MiddlewareStruct[]
  ): AnyMethodClassDecoratorReturnType {
    return (self, { kind, name }) => {
      if (kind === "method") {
        RouterCollector.middlewareMap.set(self, mws);
      }
    };
  }

  public static Get(path: string): AnyMethodClassDecoratorReturnType {
    return RouterCollector.RouteDecoratorFactory(RequestType.Get)(path);
  }

  public static Post(path: string): AnyMethodClassDecoratorReturnType {
    return RouterCollector.RouteDecoratorFactory(RequestType.Post)(path);
  }

  public static Controller(path = ""): AnyClassDecoratorReturnType {
    return (Self, { kind, name }) => {
      // @ts-ignore use ignore as expect-error not working correctly here
      RouterCollector.controllerMap.set(Self, path);
      // @ts-ignore use ignore as expect-error not working correctly here
      Container.register(name, Self);
    };
  }

  public static collect(instance: unknown): CollectedControllerInfo[] {
    const proto = Object.getPrototypeOf(instance);

    const controllerAPIRootPath = RouterCollector.controllerMap.get(
      proto.constructor
    );

    const controllerMethods = Object.getOwnPropertyNames(proto).filter(
      (i) => i !== "constructor"
    );

    const impls = controllerMethods.map((methodName) => {
      const _requestHandle: FuncStruct = proto[methodName];

      const boundRequestHandle: FuncStruct = _requestHandle.bind(instance);

      const requestMethod = RouterCollector.methodMap.get(_requestHandle)!;

      const requestPath = `${controllerAPIRootPath}${RouterCollector.pathMap.get(
        _requestHandle
      )}`;

      const middlewares =
        RouterCollector.middlewareMap.get(_requestHandle) ?? [];

      const requestHandle = async (
        req: IncomingMessage,
        res: ServerResponse
      ) => {
        const result = await boundRequestHandle(req, res);

        if (middlewares.length) {
          middlewares.forEach((mw) => {
            mw(req, res, result);
          });
        }

        return result;
      };

      return {
        requestHandle,
        requestMethod,
        requestPath,
      };
    });

    return impls;
  }
}
