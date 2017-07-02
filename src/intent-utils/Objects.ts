
export class Objects {

  public static iterate<T>(o: {[name: string]: T}): IterableIterator<T> {
    return Object.keys(o)
      .map((name) => o[name])
      [Symbol.iterator]()
    ;
  }

}
