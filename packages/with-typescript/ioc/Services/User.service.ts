import { Provide } from "decorators";

@Provide()
export class UserService {
  async QueryUser() {
    return {
      name: "linbudu",
      age: 18,
    };
  }
}
