/**
 * TypeDI implementation in NEW ES decorators.
 *
 * - Without reflect-metadata polyfill
 */

export type Constructable<T> = new (...args: any[]) => T;

export interface Provider<T = unknown> {}

class Utils {
  public static throwForIncorrectDecoratorUsage(
    expectKind: string,
    applyKind: string
  ) {
    const message = `Incorrect decorator usage. Expect ${expectKind} but got ${applyKind}`;

    if (expectKind !== applyKind) {
      throw new Error(message);
    }
  }
}

class ContainerInstance {
  public readonly id: string;

  private disposed: boolean = false;

  private disposable: boolean = true;

  // → handlers
  private readonly providers: Provider[] = [];

  constructor(id: string) {
    this.id = id;

    ContainerRegistry.registerContainer(this);
  }

  public throwIfDisposed(): void {
    if (this.disposed) {
      throw new ActionOnDisposedContainerError(this.id);
    }
  }

  public async dispose(): Promise<void> {
    this.throwIfDisposed();

    this.disposed = true;

    await Promise.resolve();
  }

  public registerProvider(provider: Provider): ContainerInstance {
    this.throwIfDisposed();

    this.providers.push(provider);

    return this;
  }

  public get() {
    this.throwIfDisposed();
  }
}

const ContainerRegistryMap = Map<string, ContainerInstance>;

class ContainerNotFoundError extends Error {
  constructor(message: unknown) {
    super();
  }
}

class ActionOnDisposedContainerError extends Error {
  constructor(message: unknown) {
    super();
  }
}

class ContainerRegistry {
  private static readonly containerRegistry = new ContainerRegistryMap();

  public static readonly default = new ContainerInstance("Container:Default");

  public static registerContainer(container: ContainerInstance) {
    ContainerRegistry.containerRegistry.set(container.id, container);
  }

  public static getContainer(id: string): ContainerInstance {
    const registered = ContainerRegistry.containerRegistry.get(id);
    if (!registered) {
      throw new ContainerNotFoundError(id);
    }

    return registered;
  }

  public static hasContainer(id: string): boolean {
    return ContainerRegistry.containerRegistry.has(id);
  }

  public static async removeContainer(container: ContainerInstance) {
    const registered = ContainerRegistry.containerRegistry.get(container.id);
    if (registered === undefined) {
      // throw from container
      throw new ContainerNotFoundError(container);
    }

    ContainerRegistry.containerRegistry.delete(container.id);

    await registered.dispose();
  }

  public static async flushRegistry() {
    const containers = Array.from(ContainerRegistry.containerRegistry.values());

    await Promise.all(containers.map((container) => container.dispose()));

    ContainerRegistry.containerRegistry.clear();
  }
}

// 其实现在的主要问题是没有了反射元数据注册的类型信息，怎么进行无参数的注入...？
class Decorators {
  public static Inject() {}

  public static Provide() {}

  public static Service = Decorators.Provide;
}
