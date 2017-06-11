
export interface CoreEvent<T> {
  type: string;
  data: T;
}

export abstract class BaseCoreEvent<T> implements CoreEvent<T> {
  public type: string;
  public data: T;

  public constructor(data: T) {
    this.data = data;
    this.type = (<typeof BaseCoreEvent>this.constructor).type();
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
