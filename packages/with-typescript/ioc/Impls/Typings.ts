export type FuncStruct<
  TArgs extends unknown[] = unknown[],
  TReturnType extends unknown = unknown
> = (...args: TArgs) => Promise<TReturnType>;

export type ClassStruct<TInstanceType extends unknown = unknown> = new (
  ...args: any[]
) => TInstanceType;
