
import { NestedFormatter } from './NestedFormatter';
import { Formatter } from "./Formatter";
import { Strings } from '../../../intent-utils/Strings';

export class Transpiler<N, T> {
  protected nested: Formatter = new NestedFormatter();
  protected sampler: Sampler = new Sampler('{%', '%}');

  public process(node: N): T {
    throw new Error(`Doesn't know how to transpile "${node.constructor.name}"`);
  }

  protected transform(template: string, data: any): string[] {
    return template.split('\n')
      .map((line) => {
        return ("" === line.trim())
          ? line
          : this.sampler.substitute(line, data);
      })
      .reduce((lines: string[], line: string|string[]) => (
        lines.concat(
          (line instanceof Array)
            ? line
            : line.split("\n")
        )
      ), [])
    ;
  }
}

interface KeyMatch {
  line: string;
  key: string;
  open: number;
  close: number;
  next: number;
}

interface KeyAcceptor {
  line: string;
  next: number|boolean;
}

class Sampler {
  public opener: string;
  public closer: string;

  public constructor(opener: string = '{%', closer: string = '%}') {
    this.opener = opener;
    this.closer = closer;
  }

  public substitute(line, data) {
    return this.match(line, ({line, key: inner, open, next}) => {
      let sample = this.wrap(inner);

      if (!(next && (next < open))) {
        return {
          line: line.replace(sample, this.transform(line, data, inner)),
          next: 0,
        };
      }

      let without = line.split(sample, 2).join('');
      let m;

      if (m = this.next(without, next)) {
        let {key: outer, open: offset} = m;
        let i = open - offset - this.opener.length;

        if (i >= 0) {
          line = this.expand(line, data, inner, outer, i);
        }
      }

      return {
        line,
        next: 0,
      };
    });
  }

  protected expand(line: string, data: any, inner: string, outer: string, insert: number) {
    let elemental = '-' + inner;
    let raw = [outer.substring(0, insert), outer.substring(insert)];
    let sample = this.wrap(inner);

    data[inner] = this.flatten(data[inner])
      .map((entry) => this.substitute(raw.join(this.wrap(elemental)), {
        [elemental]: entry,
      }))
    ;

    return this.transform(
      line.replace(this.wrap(raw.join(sample)), sample),
      data,
      inner
    );
  }

  protected wrap(key: string): string {
    return this.opener + key + this.closer;
  }

  protected match(line: string, consumer: (match: KeyMatch) => KeyAcceptor): string {
    let m, next: number|boolean = 0, r: KeyAcceptor = {line, next};

    while (m = this.next(line, <number>next)) {
      if ((r = consumer(m)) && ({line, next} = r)) {
        if (next !== false) {
          continue;
        }
      }

      break;
    }

    return line;
  }

  protected next(line: string, start: number): KeyMatch {
    let found = undefined;
    let open = Strings.lookup(line, start, this.opener);

    while (open >= 0) {
      let inner = Strings.lookup(line, open + this.opener.length, this.opener);
      let close = Strings.lookup(line, open + this.opener.length, this.closer);

      if (close < 0) {
        return;
      }

      if ((inner > 0) && (inner < close)) {
        found = open;
        open = inner;

        continue;
      }

      close += this.closer.length;

      return {
        line,
        open,
        close,
        key: line.substring(open + this.opener.length, close - this.closer.length),
        next: (found === undefined) ? close : found,
      };
    }
  }

  protected transform(line, data, key) {
    let has = data.hasOwnProperty(key);
    let code = this.wrap(key);

    if (!has) {
      return code;
    }

    let transformer = this.supports(key);
    let transformed = data[key];

    if (transformer) {
      transformed = transformer(transformed);
    }

    if (transformed instanceof Array) {
      let offset = line.indexOf(code);
      let lookup = line.match(/^(\s*)/);
      let tab = (lookup && lookup[1]) || "";
      let glue = (tab.length >= offset) ? tab : "";

      transformed = this.flatten(transformed);
      transformed = transformed.map((line) => glue + line).join("\n");
    }

    return transformed;
  }

  private flatten(array: string|string[]) {
    if (array instanceof Array) {
      return array.reduce((a: string[], c: string|string[]) => {
        return (c instanceof Array)
          ? a.concat(this.flatten(c))
          : a.concat([c])
      }, []);

    }

    return [array];
  }

  protected supports(transformer: string): (data: any) => string[] {
    return this[transformer]
      ? this[transformer].bind(this)
      : null;
  }
}
