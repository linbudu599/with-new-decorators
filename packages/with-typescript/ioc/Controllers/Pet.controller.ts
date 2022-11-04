import { Get, Post, Controller } from "decorators";
import { ServerUtils } from "server-utils";

import type { IncomingMessage, ServerResponse } from "http";

@Controller("/pet")
export class PetController {
  @Get("/query")
  async queryPet(req: IncomingMessage, res: ServerResponse) {
    return {
      success: true,
      data: {
        name: "mewo",
        kind: "cat",
        age: 2,
      },
    };
  }

  @Post("/create")
  async createPet(req: IncomingMessage, res: ServerResponse) {
    const body = await ServerUtils.parsePost(req);
    return {
      success: true,
      data: body,
    };
  }
}
