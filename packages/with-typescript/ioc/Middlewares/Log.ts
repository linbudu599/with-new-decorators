import { MiddlewareStruct } from "ioc/Impls/Typings";

export const LogMiddleware: MiddlewareStruct = (req, res, result) => {
  console.log(
    `[Middleware] This is result for ${req.method} ${req.url}: ${JSON.stringify(
      result
    )}\n`
  );

  return result;
};
