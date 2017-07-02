
import { Container } from './Container';

export class Objects {

  public static iterate<T>(o: Container<T>): IterableIterator<T> {
    return Object.keys(o)
      .map((name) => o[name])
      [Symbol.iterator]()
    ;
  }

}
