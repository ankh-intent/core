
export interface CoreEvent<T> {
  type: string;
  data: T;
  parent: CoreEvent<any>;
}

export abstract class BaseCoreEvent<T> implements CoreEvent<T> {
  public type: string;
  public data: T;
  public parent: CoreEvent<any>;

  public constructor(data: T, parent?: CoreEvent<any>) {
    this.data = data;
    this.type = (<typeof BaseCoreEvent>this.constructor).type();
    this.parent = parent;
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
