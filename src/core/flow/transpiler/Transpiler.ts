
import { Strings } from '../../../intent-utils/Strings';
import { Container } from './Container';

export class Transpiler<N, T> {
  protected sampler: Sampler;

  public process(node: N): T {
    throw new Error(`Doesn't know how to transpile "${node.constructor.name}"`);
  }

  protected template(template: string, resolver: (data) => any): (data: any) => string[] {
    let processed = {};

    let optimized = template
      .replace(/(\s+$)/, '')
      .split('\n')
      .map((line, index) => {
        if ("" !== line.trim()) {
          if (this.sampler.next(line, 0)) {
            processed[index] = false;
          }
        }

        return String(line);
      })
    ;

    return (data) => {
      let resolved = resolver(data);

      return optimized.map((line, index) => {
        return processed[index]
          ? this.sampler.substitute(line, resolved)
          : line;
      }).reduce((lines: string[], line: string|string[]) => (
        lines.concat(
          (line instanceof Array)
            ? line
            : line.split("\n")
        )
      ), [])
    };
  }

  protected container<T>(child: string): (data: any) => string[] {
    return this.template(
      '{%' + child + '%}',
      (container: Container<T>) => ({[child]: container})
    );
  }

  protected transform(template: (data) => string[], data: any): string[] {
    return template(data);
  }

  protected map<T>(container: Container<T>, consumer: (i: T) => string[]): string[] {
    return this.sampler.transform(
      Object.keys(container).map((name) => consumer(container[name]))
    );
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

export class Sampler {
  public opener: string;
  public closer: string;
  private transformers: any;

  public constructor(transformers: any, opener: string = '{%', closer: string = '%}') {
    this.transformers = transformers;
    this.opener = opener;
    this.closer = closer;
  }

  public substitute(line, data) {
    return this.match(line, ({line, key: inner, open, next}) => {
      let sample = this.wrap(inner);

      if (!(next && (next < open))) {
        return {
          line: line.replace(sample, this.transformKey(line, data, inner)),
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

  protected expand(line: string, data: any, inner: string, outer: string, insert: number): string {
    let elemental = '-' + inner;
    let raw = [outer.substring(0, insert), outer.substring(insert)];
    let sample = this.wrap(inner);

    data[inner] = this.flatten(data[inner])
      .map((entry) => this.substitute(raw.join(this.wrap(elemental)), {
        [elemental]: entry,
      }))
    ;

    return this.transformKey(
      line.replace(this.wrap(raw.join(sample)), sample),
      data,
      inner
    );
  }

  public wrap(key: string): string {
    return this.opener + key + this.closer;
  }

  public match(line: string, consumer: (match: KeyMatch) => KeyAcceptor): string {
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

  public next(line: string, start: number): KeyMatch {
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

  public transformKey(line, data, key) {
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
      transformed = transformed.map((line) => glue + line);
    }

    return this.transform(transformed).join("\n");
  }

  public transform(data: any): string[] {
    if (data instanceof Array) {
      data = this.flatten(data);
    } else {
      let string = String(data);

      if (string === '[object Object]') {
        string = JSON.stringify(data);
      }

      data = string.split("\n");
    }

    return data;
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
    return this.transformers[transformer];
  }
}
