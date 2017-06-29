
import { TemplateInterface } from './compiler/TemplateInterface';

export declare type Templateable<S, R> = string|TemplateInterface<S, R>;

export class CompoundTemplate<S, R> implements TemplateInterface<S, R> {
  private lines: Templateable<S, R>[];

  public constructor(lines: Templateable<S, R>[]) {
    this.lines = lines;
  }

  public apply(data: S): R {
    return <any>this.fold(
      this.lines.map((line: Templateable<S, R>) => (
        typeof line === 'string'
          ? <any>line
          : line.apply(data)
      ))
    );
  }

  protected fold(a: (string|string[])[]): string[] {
    if (typeof a === 'string') {
      return [a];
    }

    let result = [];

    for (let element of a) {
      if (typeof element === 'string') {
        result.push(element);
      } else {
        result = result.concat(
          this.fold(element)
        );
      }
    }

    return result;
  }
}
