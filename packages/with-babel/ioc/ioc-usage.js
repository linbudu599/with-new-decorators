/// <reference path="../../../typing.d.ts" />
import assert from "assert";
import { Provide, Inject } from "./container";

@Provide()
class FSService {
  write(path, content) {
    console.log("---FSService:WriteLogFile---", path, content, "\n");
  }
}

@Provide()
class LoggerService {
  /** @type {FSService} */
  @Inject("FSService")
  fs;

  log(...msgs) {
    this.fs.write("log.txt", msgs);
    console.log("---LoggerService:Log---", msgs, "\n");
  }
}

/* prettier-ignore */
export @Provide() class UserService {
  query() {
    return {
      name: "linbudu",
      age: 18,
    };
  }
}

class UserModule {
  /** @type {LoggerService} */
  @Inject("LoggerService")
  logger;

  /** @type {UserService} */
  @Inject("UserService")
  userService;

  QueryUser() {
    const res = this.userService.query();
    this.logger.log(`UserModule.QueryUser: ${JSON.stringify(res)}`);
    return res;
  }
}

assert.deepStrictEqual(new UserModule().QueryUser(), {
  name: "linbudu",
  age: 18,
});
