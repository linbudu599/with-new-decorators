import http from "http";
import { pathToRegexp, match } from "path-to-regexp";
import { RouterCollector } from "core";

import type { ClassStruct } from "./Typings";

export type CreateAppOptions = {
  controllers: ClassStruct[];
};

class App {
  public static async createApp(
    port: number,
    options: CreateAppOptions
  ): Promise<http.Server> {
    return new Promise<http.Server>((resolve, reject) => {
      const { controllers } = options;

      const collectedRequestHandlers = controllers
        .map((Controller) => RouterCollector.collect(new Controller()))
        .flat();

      const server = http.createServer((req, res) => {
        let currentRequestHandled = false;

        for (const info of collectedRequestHandlers) {
          const pathRegexp = pathToRegexp(info.requestPath);
          const pathMatched = pathRegexp.test(req.url);
          const methodMatched =
            req.method === info.requestMethod.toLocaleUpperCase();

          if (pathMatched && methodMatched) {
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
      });

      server.listen(port, "localhost");

      server.on("error", (error) => {
        process.exit(1);
      });

      resolve(server);
    });
  }
}

export const { createApp } = App;
