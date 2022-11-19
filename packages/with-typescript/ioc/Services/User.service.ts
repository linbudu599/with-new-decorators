import { Provide } from "decorators";

@Provide()
export class UserService {
  async QueryUser() {
    return {
      id: 100,
      name: "linbudu",
      age: 18,
    };
  }

  async CreateUser(input) {
    return {
      id: 599,
      ...input,
    };
  }
}
