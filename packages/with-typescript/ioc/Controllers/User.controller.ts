import { Get, Post, Controller, Inject, Provide, Middleware } from "decorators";
import { ServerUtils } from "server-utils";

import { UserService } from "../Services/User.service";

import type { IncomingMessage, ServerResponse } from "http";
import { LogMiddleware } from "../Middlewares/Log";

@Controller("/user")
export class UserController {
  // @ts-expect-error
  @Inject("UserService")
  // @ts-expect-error
  userService: UserService = {};

  @Get("/query")
  @Middleware([LogMiddleware])
  async queryUser(req: IncomingMessage, res: ServerResponse) {
    const data = await this.userService.QueryUser();
    return {
      success: true,
      data,
    };
  }

  @Post("/create")
  async createUser(req: IncomingMessage, res: ServerResponse) {
    const body = await ServerUtils.parsePost(req);
    const data = await this.userService.CreateUser(body);
    return {
      success: true,
      data,
    };
  }
}
