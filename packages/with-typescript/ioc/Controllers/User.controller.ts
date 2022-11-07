import { Get, Post, Controller, Inject, Provide } from "decorators";
import { ServerUtils } from "server-utils";

import { UserService } from "../Services/User.service";

import type { IncomingMessage, ServerResponse } from "http";

@Controller("/user")
export class UserController {
  // TODO:
  // @Inject("UserService")
  // userService: UserService;

  @Get("/query")
  async queryUser(req: IncomingMessage, res: ServerResponse) {
    // console.log(this.userService);
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
