import { createApp } from "create-server";

import { UserController } from "./Controllers/User.controller";

const app = createApp(5999, {
  controllers: [UserController],
});

app.then((server) => {
  server.on("listening", () => {
    const serverBaseAddress = server.address();

    const serverBaseUrl =
      typeof serverBaseAddress === "string"
        ? serverBaseAddress
        : `http://${serverBaseAddress.address}:${serverBaseAddress.port}`;

    console.log(`✨✨✨ Server ready at ${serverBaseUrl} \n`);
    console.log(`GET /user/query at ${serverBaseUrl}/user/query`);
    console.log(`POST /user/create at ${serverBaseUrl}/user/create \n`);
  });
});
