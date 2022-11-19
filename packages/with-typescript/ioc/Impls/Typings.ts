import type { IncomingMessage, ServerResponse } from "http";

export type FuncStruct<
  TArgs extends unknown[] = unknown[],
  TReturnType extends unknown = unknown
> = (...args: TArgs) => Promise<TReturnType>;

export type ClassStruct<TInstanceType extends unknown = unknown> = new (
  ...args: any[]
) => TInstanceType;

export type CommonClassStruct<TInstanceType extends unknown = unknown> =
  abstract new (...args: any[]) => TInstanceType;

export type MiddlewareStruct = (
  req: IncomingMessage,
  res: ServerResponse,
  result: unknown
) => unknown;
