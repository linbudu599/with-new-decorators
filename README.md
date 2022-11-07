# with-new-decorators

Deep dive in the [new ECMAScript Decorator](https://github.com/tc39/proposal-decorators), different kinds of decorators, new ones and old ones, and build IoC Container by various ways.

## With TypeScript

A related PR [#50820](https://github.com/microsoft/TypeScript/pull/50820) is still in progress, maybe we can see the preview in 5.0 beta version.

UPDATE: You can install developing version of typescript from tarball version like this:

```json
"devDependencies": {
  "typescript": "https://typescript.visualstudio.com/cf7ac146-d525-443c-b23c-0d58337efebc/_apis/build/builds/137418/artifacts?artifactName=tgz&fileId=AB77B9F7C08B0A35E9947DAD772F3CFFC61A6E13DD551F32AB732DDCDD7DF4F102&fileName=/typescript-5.0.0-insiders.20221101.tgz"
}
```

Completed Samples:

- [IoC Related Samples](packages/with-typescript/ioc/)

And it would work like this(simplified):

```typescript
import { createApp } from "create-server";

import { UserController } from "./Controllers/User.controller";
import { PetController } from "./Controllers/Pet.controller";
import { RootController } from "./Controllers/Root.controller";

import { UserService } from "./Services/User.service";

const app = createApp(5999, {
  controllers: [UserController, PetController],
  services: [UserService],
});

app.then((server) => {
  server.on("listening", () => {
    const serverBaseUrl = "http://localhost:5999";

    console.log(`✨✨✨ Server ready at ${serverBaseUrl} \n`);
  });
});
```

## With Babel

Install these dependencies to use new decorator proposals:

```bash
pnpm i @babel/cli @babel/core @babel/node @babel/preset-env @babel/plugin-proposal-decorators --save-dev
```

Configure your `.babelrc` file like below:

```ini
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    [
      "@babel/plugin-proposal-decorators",
      {
        // specify version to use latest impl
        "version": "2022-03"
      }
    ]
  ]
}
```

Then you can use `babel-node` to execute javascript file, but `nodemon` can bring you better DX.

- [Common Samples](packages/with-babel/samples/)
- [IoC Related Samples](packages/with-babel/ioc)
