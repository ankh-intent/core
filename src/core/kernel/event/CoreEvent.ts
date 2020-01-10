
export interface CoreEvent<T> {
  readonly type: string;
  readonly data: T;
  parent: CoreEvent<any>|null;
  bubble: boolean;

  hasParent(event: CoreEvent<any>): CoreEvent<any>|null;
  stopPropagation(stop?: boolean);
}

export abstract class BaseCoreEvent<T> implements CoreEvent<T> {
  public readonly type: string;
  public readonly data: T;
  public parent: CoreEvent<any>|null = null;
  public bubble: boolean;

  public constructor(data: T, parent: CoreEvent<any>|null = null) {
    this.data = data;
    this.type = (<typeof BaseCoreEvent>this.constructor).type();
    this.parent = parent;
    this.bubble = true;
  }

  public stopPropagation(stop: boolean = true) {
    this.bubble = !stop;
  }

  public hasParent(event: CoreEvent<any>): CoreEvent<any>|null {
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
  consume(event: E): CoreEvent<any>|void;
}
