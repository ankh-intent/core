
import { TemplateInterface } from './compiler/TemplateInterface';
import { DataResolver, SubstitutorInterface } from './Substitutor';
import { MatchedPlaceholder } from './compiler/SamplerInterface';

export class Template<S> implements TemplateInterface<S, string[]> {
  private substitutor: SubstitutorInterface<S, string[]>;
  private resolver: DataResolver<S>;
  private line: string;

  public constructor(line: string, substitutor: SubstitutorInterface<S, string[]>, resolver: DataResolver<S>) {
    this.line = line;
    this.substitutor = substitutor;
    this.resolver = resolver;
  }

  public apply(data: S): string[] {
    return this.substitute(this.line, data);
  }

  protected substitute(line: string, data: any): string[] {
    return this.fold(
      this.substitutor.substitute(
        line,
        data,
        this.consume.bind(this),
        this.resolver
      )
    );
  }

  protected multiple(lines: string[], data: any): string[] {
    return this.fold(
      lines.map((line: string) => this.substitute(line, data))
    )
  }

  private consume(line: any, match: MatchedPlaceholder, data: S[keyof S]): any {
    let multi = typeof line !== 'string';

    return this.replace(
      multi ? line : [line],
      data,
      match
    );
  }

  protected replace(lines: string[], data: any, match: MatchedPlaceholder): string[] {
    if (data instanceof Array) {
      return this.fold(
        data.map((data) => this.replace(lines, data, match))
      );
    }

    let str;

    if (data !== null) {
      if (typeof data === 'object') {
        let name = (data.constructor !== Object) ? data.constructor.name : '<Unresolved>';

        str = `{{ Object(${name}) }}`;
      } else {
        str = String(data);
      }
    } else {
      str = '{{ null }}';
    }

    return lines.map((line) => (
      line.substr(0, match.open) + str + line.substr(match.close)
    ));
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
