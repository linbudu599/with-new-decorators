import { Get, Controller } from "decorators";

import type { IncomingMessage, ServerResponse } from "http";

@Controller()
export class RootController {
  @Get("/")
  async sayHi(req: IncomingMessage, res: ServerResponse) {
    const query = req.url;

    return {
      success: true,
      message: "Hi!",
      data: {},
    };
  }
}
