
export interface CoreEvent<T = any> {
  readonly type: string;
  readonly data: T;
  parent: CoreEvent|null;
  bubble: boolean;

  hasParent(event: CoreEvent): CoreEvent|null;
  stopPropagation(stop?: boolean);
}

export abstract class BaseCoreEvent<T> implements CoreEvent<T> {
  public readonly type: string;
  public readonly data: T;
  public parent: CoreEvent|null = null;
  public bubble: boolean;

  public constructor(data: T, parent: CoreEvent|null = null) {
    this.data = data;
    this.type = (<typeof BaseCoreEvent>this.constructor).type();
    this.parent = parent;
    this.bubble = true;
  }

  public stopPropagation(stop: boolean = true) {
    this.bubble = !stop;
  }

  public hasParent(event: CoreEvent): CoreEvent|null {
    let parent = this.parent;

    while (parent) {
      if (parent === event) {
        return this;
      }

      parent = parent.parent;
    }

    return null;
  }

  public static type(): string {
    return this.name
      .replace(/Event$/, '')
      .toLowerCase();
  }
}

export interface CoreEventConsumer<T, E extends CoreEvent<T>> {
  consume(event: E): CoreEvent|void;
}
