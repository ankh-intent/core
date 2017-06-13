
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

  public substitute(context: TemplateContext<D, string>): string[] {
    let match, found = 0, lines = [context.code], line, done = [];
    let inner, open, close;

    while (line = lines.shift()) {
      while (match = this.next(line, found)) {
        ({key: inner, open, close, next: found} = match);

        if (this.visitors.has(inner)) {
          line = this.replace(
            line,
            inner,
            this.visitors.visit(inner, context)
          );

          break;
        }

        if (inner.match(/^[.*=]/)) {
          let prop = inner.substr(1);

          if (this.visitors.has(prop)) {
            switch (inner[0]) {
              case '=':
                line = this.handleResolve(line, context, inner, prop);
                break;
            }
          } else {
            switch (inner[0]) {
              case '=':
                line = this.handleResolve(line, context, inner, prop);
                break;
            }
          }

          found = 0;
          break;
        }

        if ((found === undefined) || (found < 0)) {
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

  protected handleEnum(line: string, context: TemplateContext<D, string>, placeholder: string, entry: keyof D): string[] {
    let keys = <(keyof D)[]>Object.keys(context.data);
    let all = new Array(keys.length);

    for (let i in keys) {
      let one = this.handleProp(
        line,
        context,
        placeholder,
        entry,
        keys[i]
      );

      if (one.length) {
        all.push(one);
      }
    }

    return all;
  }

  protected handleProp(line: string, context: TemplateContext<D, string>, placeholder: string, entry: keyof D, ref: keyof D = entry): string[] {
    return this.replace(
      line,
      placeholder,
      this.visitors.visit(
        entry,
        context.apply(ref)
      )
    );
  }

  protected handleResolve(line: string, context: TemplateContext<D, string>, placeholder: string, entry: keyof D): string[] {
    if (!this.visitors.has(entry)) {
      this.visitors.bridge(context.template, entry);
    }

    return this.replace(
      line,
      placeholder,
      this.visitors.visit(
        entry,
        context.apply(entry)
      )
    );
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
