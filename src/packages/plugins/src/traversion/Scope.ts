export class Scope<T, N extends keyof T = keyof T> {
  protected readonly parent?: Scope<T, N>;
  public readonly data: T;

  constructor(data: T, parent?: Scope<T, N>) {
    this.parent = parent;
    this.data = data;
  }

  nest(data: T): this {
    return Reflect.construct(this.constructor, [data, this]);
  }

  get depth(): number {
    return 1 + (this.parent?.depth || 0);
  }

  set(name: N, value: T[N]) {
    this.data[name] = value;

    return value;
  }

  delete(name: N) {
    return delete this.data[name];
  }

  get(name: N): T[N]|null {
    return this.data[name] || this.parent?.get(name) || null;
  }
}
