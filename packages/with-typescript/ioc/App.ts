import http from "http";
import { createApp } from "create-server";

import { UserController } from "./Controllers/User.controller";
import { PetController } from "./Controllers/Pet.controller";
import { RootController } from "./Controllers/Root.controller";

const Port = 5999;

const app = createApp(Port, {
  controllers: [UserController, PetController, RootController],
});

const requestAPI = (method: string, path: string, payload?: unknown) => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        method,
        hostname: "localhost",
        port: Port,
        path,
      },
      (res) => {
        const chunks = [];

        res.on("data", (chunk) => {
          chunks.push(chunk);
        });

        res.on("end", () => {
          console.log(
            `${method.toUpperCase()} ${path} response: `,
            Buffer.concat(chunks).toString()
          );
        });
      }
    );

    payload && req.write(JSON.stringify(payload));

    req.end();
  });
};

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
    console.log(`GET /pet/query at ${serverBaseUrl}/pet/query`);
    console.log(`POST /pet/create at ${serverBaseUrl}/pet/create \n`);

    requestAPI("GET", "/");

    requestAPI("GET", "/user/query");
    requestAPI("POST", "/user/create", { name: "Harold", age: 18 });

    requestAPI("GET", "/pet/query");
    // so your bird got the same name with yourself?
    requestAPI("POST", "/pet/create", { name: "Harold", kind: "bird", age: 3 });
  });
});
