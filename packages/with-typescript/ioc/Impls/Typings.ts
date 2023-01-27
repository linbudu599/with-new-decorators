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

export type AnyClassFieldDecoratorReturnType = (
  a1: undefined,
  context: ClassFieldDecoratorContext
) => (initialValue: any) => any | void;

export type AnyClassDecoratorReturnType = (
  target: any,
  context: ClassDecoratorContext
) => void;

export type AnyMethodClassDecoratorReturnType = (
  target: any,
  context: ClassMethodDecoratorContext
) => void;
