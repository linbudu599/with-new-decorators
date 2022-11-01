# with-new-decorators

Deep dive in the [new ECMAScript Decorator](https://github.com/tc39/proposal-decorators), different kinds of decorators, new ones and old ones, and build IoC Container by various ways.

## With Babel

Install these dependencies to use new decorator proposals:

```bash
npm i @babel/cli @babel/core @babel/node @babel/preset-env @babel/plugin-proposal-decorators --save-dev
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

- [samples](packages/with-babel/samples/)
- [Simple Ioc Container](packages/with-babel/samples/ioc-container.js)

## With TypeScript

A related PR [#50820](https://github.com/microsoft/TypeScript/pull/50820) is still in progress, maybe we can see the preview in 5.0 beta version.
