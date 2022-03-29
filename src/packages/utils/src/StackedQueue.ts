export class StackedQueue<T> {
  private readonly stack: T[][] = [[]];

  public pushState(): number {
    return this.stack.push([]) - 1;
  }

  public popState(id: number) {
    this.stack.splice(id, this.stack.length - 1);
  }

  public has(item: T): number {
    let queue: T[];
    let i = this.stack.length;

    while ((queue = this.stack[--i])) {
      if (queue.length && queue.lastIndexOf(item) >= 0) {
        return i;
      }
    }

    return -1;
  }

  public mark(item: T) {
    this.top.push(item);
  }

  public get top(): T[] {
    return this.stack[this.stack.length - 1];
  }
}
