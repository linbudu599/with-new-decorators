import assert from "assert";
import { Provide, Inject } from "decorators";

@Provide()
class FSService {
  write(path: string, content: any) {
    console.log("---FSService:WriteLogFile---", path, content, "\n");
  }
}

@Provide()
class LoggerService {
  @Inject("FSService")
  fs: FSService;

  log(...msgs) {
    this.fs.write("log.txt", msgs);
    console.log("---LoggerService:Log---", msgs, "\n");
  }
}

@Provide()
class UserService {
  query() {
    return {
      name: "linbudu",
      age: 18,
    };
  }
}

class UserModule {
  @Inject("LoggerService")
  logger: LoggerService;

  @Inject("UserService")
  userService = {};

  // This sample seems to be incomplete for typescript
  QueryUser() {
    // const res = this.userService.query();
    console.log("11-07 this.userService: ", this.userService);

    // this.logger.log(`UserModule.QueryUser: ${JSON.stringify(res)}`);
    // return res;
  }
}
new UserModule().QueryUser();
// assert.deepStrictEqual(new UserModule().QueryUser(), {
//   name: "linbudu",
//   age: 18,
// });
