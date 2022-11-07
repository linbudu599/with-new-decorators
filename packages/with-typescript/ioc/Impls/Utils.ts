import type { IncomingMessage } from "http";

export class ServerUtils {
  public static async parsePost(req: IncomingMessage) {
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
