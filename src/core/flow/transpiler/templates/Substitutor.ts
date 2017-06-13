
import { TemplateContext } from './TemplateContext';
import { AbstractTemplate } from './Template';
import { Sampler } from '../Sampler';
import { TemplateVisitors } from "./TemplateVisitors";

export class Substitutor<D, T extends AbstractTemplate<D, string> = any> extends Sampler {
  protected visitors: TemplateVisitors<D, string>;

  public constructor(visitors: TemplateVisitors<D, string>, opener: string = '{%', closer: string = '%}') {
    super(opener, closer);
    this.visitors = visitors;
  }

  public substitute(context: TemplateContext<D, string[]>): string[] {
    let match, found = 0, lines = [context.code], line, done = [];
    let inner, open, close, m;

    while (line = lines.shift()) {
      while (match = this.next(line, found)) {
        ({key: inner, open, close, next: found} = match);

        if (m = inner.match(/^(.*)\*$/)) {
          let iterated = m[1];

          if (this.visitors.has(iterated)) {
            let all = [];

            for (let prop of Object.keys(context.data)) {
              let one = this.replace(
                line,
                inner,
                this.visitors.visit(iterated, context.apply(<any>prop))
              );

              all = all.concat(one);
            }

            line = all;
          }

          break;
        }

        if (this.visitors.has(inner)) {
          line = this.replace(
            line,
            inner,
            this.visitors.visit(inner, context)
          );

          break;
        }

        if (!found) {
          break;
        }

        if (open > found) {
          found = close;
        }
      }

      done.push(line);
    }

    return done;
  }

  protected replace(line: string, inner: string, data): string[] {
    let placeholder = this.wrap(inner);

    return this.flatten(
      (data instanceof Array)
        ? data.map((entry) => this.replace(line, inner, entry))
        : line.replace(placeholder, data)
    );
  }

  private flatten(array: any|any[]): any[] {
    if (array instanceof Array) {
      return array.reduce((a: any[], c: any|any[]) => {
        return (c instanceof Array)
          ? a.concat(this.flatten(c))
          : a.concat([c])
      }, []);
    }

    return [array];
  }
}
