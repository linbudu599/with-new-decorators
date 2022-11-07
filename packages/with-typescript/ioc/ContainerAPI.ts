import assert from "assert";
import { Provide, Inject, Scope } from "decorators";
import { ScopeEnum } from "server-utils";

@Provide()
@Scope(ScopeEnum.Singleton)
class FSService {
  write(path: string, content: any) {
    console.log("---FSService:WriteLogFile---", path, content, "\n");
  }
}

@Provide()
class LoggerService {
  @Inject("FSService")
  fs: FSService = {};

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
  logger: LoggerService = {};

  // TS can only replace field value with initialValue
  // PR: https://github.com/microsoft/TypeScript/pull/50820#issuecomment-1305265363
  @Inject("UserService")
  userService: UserService = {};

  // This sample seems to be incomplete for typescript
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
