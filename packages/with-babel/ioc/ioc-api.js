/// <reference path="../../../typing.d.ts" />
import http from "http";

const RequestType = {
  Get: "Get",
  Post: "Post",
};

// In real-world apps or frameworks we will create collector instance for every controller
// But we just want it to be easy:-)

class RouterCollector {
  static #controllerMap = new Map();
  static #methodMap = new Map();
  static #pathMap = new Map();

  /** @type {(method: string) => (path: string) => ClassMethodDecoratorNew} */
  static RouteDecoratorFactory(method) {
    return (path) => {
      return (self, { kind, name }) => {
        if (kind === "method") {
          RouterCollector.#pathMap.set(self, path);
          RouterCollector.#methodMap.set(self, method);
        }
      };
    };
  }

  /** @type {(path: string) => ClassMethodDecoratorNew} */
  static Get(path) {
    return RouterCollector.RouteDecoratorFactory(RequestType.Get)(path);
  }

  /** @type {(path: string) => ClassMethodDecoratorNew} */
  static Post(path) {
    return RouterCollector.RouteDecoratorFactory(RequestType.Post)(path);
  }

  /** @type {(path?: string) => ClassDecoratorNew} */
  static Controller(path = "") {
    return (Self, { kind, name }) => {
      RouterCollector.#controllerMap.set(Self, path);
    };
  }

  static collect(instance) {
    const proto = Object.getPrototypeOf(instance);

    const controllerAPIRootPath = RouterCollector.#controllerMap.get(
      proto.constructor
    );

    const controllerMethods = Object.getOwnPropertyNames(proto).filter(
      (i) => i !== "constructor"
    );

    const impls = controllerMethods.map((methodName) => {
      const requestHandle = proto[methodName];
      const requestMethod = RouterCollector.#methodMap.get(requestHandle);
      const requestPath = `${controllerAPIRootPath}${RouterCollector.#pathMap.get(
        requestHandle
      )}`;

      return {
        requestHandle: requestHandle.bind(instance),
        requestMethod,
        requestPath,
      };
    });

    return impls;
  }
}

const { Get, Post, Controller } = RouterCollector;

class ServerUtils {
  /** @type {(req: http.IncomingMessage) => Promise<unknown>} */
  static async parsePost(req) {
    return new Promise((resolve, reject) => {
      const data = [];
      req.on("data", (chunk) => {
        data.push(chunk);
      });

      req.on("end", () => {
        resolve(JSON.parse(Buffer.concat(data).toString()));
      });
      req.on("error", (error) => {
        reject(error);
      });
    });
  }
}

@Controller("/user")
class UserController {
  /** @type {(req: http.IncomingMessage, res: http.ServerResponse) => Promise<unknown>} */
  @Get("/query")
  // As parameter decorator is not supported in current proposal,
  // we inject request body by default
  async queryUser(req, res) {
    return {
      success: true,
      data: {
        name: "Linbudu",
        age: 18,
      },
    };
  }

  /** @type {(req: http.IncomingMessage, res: http.ServerResponse) => Promise<unknown>} */
  @Post("/create")
  async createUser(req, res) {
    const body = await ServerUtils.parsePost(req);
    return {
      success: true,
      data: body,
    };
  }
}

const controllerHandleInfo = RouterCollector.collect(new UserController());

http
  .createServer((req, res) => {
    let currentRequestHandled = false;
    for (const info of controllerHandleInfo) {
      if (
        req.url === info.requestPath &&
        req.method === info.requestMethod.toLocaleUpperCase()
      ) {
        currentRequestHandled = true;
        info.requestHandle(req, res).then((result) => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result));
        });
      }
    }

    if (!currentRequestHandled) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(`Cannot ${req.method.toUpperCase()} ${req.url}`);
    }
  })
  .listen(3000)
  .on("listening", () => {
    console.log("✨✨✨ Server ready at http://localhost:3000 \n");
    console.log("GET /user/query at http://localhost:3000/user/query");
    console.log("POST /user/create at http://localhost:3000/user/create \n");

    http
      .request(
        {
          hostname: "localhost",
          port: 3000,
          path: "/user/query",
        },
        (res) => {
          const chunks = [];
          res.on("data", (chunk) => {
            chunks.push(chunk);
          });
          res.on("end", () => {
            console.log(
              "GET /user/query response: ",
              Buffer.concat(chunks).toString()
            );
          });
        }
      )
      .end();

    const postReq = http.request(
      {
        hostname: "localhost",
        port: 3000,
        path: "/user/create",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => {
          chunks.push(chunk);
        });
        res.on("end", () => {
          console.log(
            "POST /user/query response: ",
            Buffer.concat(chunks).toString()
          );
        });
      }
    );

    postReq.write(
      JSON.stringify({
        name: "Harold",
        age: 18,
      })
    );

    postReq.end();
  });
