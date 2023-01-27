import { RouterCollector } from "core";
import { Container } from "container";

export const { Get, Post, Controller, Middleware } = RouterCollector;
export const { Provide, Inject, Scope } = Container;

export type AnyClassFieldDecoratorReturnType = (
  a1: undefined,
  context: ClassFieldDecoratorContext
) => (initialValue: any) => any | void;

export type AnyClassDecoratorReturnType = (
  target: any,
  context: ClassDecoratorContext
) => void;
