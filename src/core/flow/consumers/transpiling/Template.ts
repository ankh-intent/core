
import { TemplateInterface } from './compiler/TemplateInterface';
import { SubstitutorInterface } from './Substitutor';
import { MatchedPlaceholder } from './compiler/SamplerInterface';

export class Template<S> implements TemplateInterface<S, string[]> {
  private substitutor: SubstitutorInterface<S, string[]>;
  private line: string;

  public constructor(line: string, substitutor: SubstitutorInterface<S, string[]>) {
    this.line = line;
    this.substitutor = substitutor;
  }

  public apply(data: S): string[] {
    return this.substitute(this.line, data);
  }

  protected substitute(line: string, data: any): string[] {
    return this.fold(
      this.substitutor.substitute(line, data, (line: any, match: MatchedPlaceholder, data: S[keyof S]) => {
        let multi = typeof line !== 'string';

        if ((data !== null) && (typeof data === 'object')) {
          return this.fold(
            Object.keys(data).map((key) => {
              let mapped = {
                [match.key]: data[key],
              };

              return (
                multi
                  ? this.multiple(line, mapped)
                  : this.substitute(line, mapped)
              );
            })
          );
        }

        let str = (data !== null) ? String(data) : '';

        if (multi) {
          return line.map((line) => (
            line.substr(0, match.open) + str + line.substr(match.close)
          ));
        }

        return line.substr(0, match.open) + str + line.substr(match.close);
      })
    );
  }

  protected multiple(lines: string[], data: any): string[] {
    return this.fold(
      lines.map((line: string) => this.substitute(line, data))
    )
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
