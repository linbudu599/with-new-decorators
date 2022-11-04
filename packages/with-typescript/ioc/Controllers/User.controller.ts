import { Get, Post, Controller } from "decorators";
import { ServerUtils } from "server-utils";

import type { IncomingMessage, ServerResponse } from "http";

@Controller("/user")
export class UserController {
  @Get("/query")
  async queryUser(req: IncomingMessage, res: ServerResponse) {
    return {
      success: true,
      data: {
        name: "Linbudu",
        age: 18,
      },
    };
  }

  @Post("/create")
  async createUser(req: IncomingMessage, res: ServerResponse) {
    const body = await ServerUtils.parsePost(req);
    return {
      success: true,
      data: body,
    };
  }
}
