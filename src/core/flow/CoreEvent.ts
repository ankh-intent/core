
export interface CoreEvent<T> {
  type: string;
  data: T;
  parent: CoreEvent<any>;
  bubble: boolean;

  hasParent(event: CoreEvent<any>): CoreEvent<any>;
}

export abstract class BaseCoreEvent<T> implements CoreEvent<T> {
  public type: string;
  public data: T;
  public parent: CoreEvent<any>;
  public bubble: boolean;

  public constructor(data: T, parent?: CoreEvent<any>) {
    this.data = data;
    this.type = (<typeof BaseCoreEvent>this.constructor).type();
    this.parent = parent;
    this.bubble = true;
  }

  public stopPropagation() {
    this.bubble = false;
  }

  public hasParent(event: CoreEvent<any>): CoreEvent<any> {
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
