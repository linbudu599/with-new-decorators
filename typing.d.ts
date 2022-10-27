declare type DecoratorKind =
  | "class"
  | "method"
  | "field"
  | "setter"
  | "getter"
  | "accessor";

declare type Decorator = <Accessor, Input, Output>(
  value: Input,
  context: {
    kind: DecoratorKind;
    name: string | symbol;
    // 获取实例上元素的最终值，而不是传递给装饰器的当前值
    access: {
      get: () => Accessor;
      set?: (value: Accessor) => void;
    };
    private?: boolean;
    static?: boolean;
    // 允许用户添加额外的初始化逻辑。这适用于所有按类操作的装饰器
    addInitializer?: (initializer: () => void) => void;
  }
) => Output | void;

declare type ClassMethodDecoratorNew = (
  value: Function,
  context: {
    kind: "method";
    name: string | symbol;
    access: { get: () => unknown };
    static: boolean;
    private: boolean;
    addInitializer: (initializer: () => void) => void;
  }
) => Function | void;

declare type ClassGetterDecorator = (
  value: Function,
  context: {
    kind: "getter";
    name: string | symbol;
    access: { get: () => unknown };
    static: boolean;
    private: boolean;
    addInitializer: (initializer: () => void) => void;
  }
) => Function | void;

declare type ClassSetterDecorator = (
  value: Function,
  context: {
    kind: "setter";
    name: string | symbol;
    access: { set: (value: unknown) => void };
    static: boolean;
    private: boolean;
    addInitializer: (initializer: () => void) => void;
  }
) => Function | void;

declare type ClassFieldDecorator = (
  value: undefined,
  context: {
    kind: "field";
    name: string | symbol;
    access: { get: () => unknown; set: (value: unknown) => void };
    static: boolean;
    private: boolean;
  }
) => (initialValue: unknown) => unknown | void;

declare type ClassDecoratorNew = (
  value: Function,
  context: {
    kind: "class";
    name: string | undefined;
    addInitializer: (initializer: () => void) => void;
  }
) => Function | void;

declare type ClassAutoAccessorDecorator = (
  value: {
    get: () => unknown;
    set: (value: unknown) => void;
  },
  context: {
    kind: "accessor";
    name: string | symbol;
    access: { get: () => unknown; set: (value: unknown) => void };
    static: boolean;
    private: boolean;
    addInitializer: (initializer: () => void) => void;
  }
) => {
  get?: () => unknown;
  set?: (value: unknown) => void;
  init?: (initialValue: unknown) => unknown;
} | void;
