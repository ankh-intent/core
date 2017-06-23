
import { TemplateInterface } from './compiler/TemplateInterface';
import { SubstitutorInterface } from './Substitutor';
import { MatchedPlaceholder } from './compiler/SamplerInterface';

export class Template<S> implements TemplateInterface<S, string[]> {
  private substitutor: SubstitutorInterface<S, string[]>;
  private lines: string[];

  public constructor(lines: string[], substitutor: SubstitutorInterface<S, string[]>) {
    this.lines = lines;
    this.substitutor = substitutor;
  }

  public apply(data: S): string[] {
    return this.substitute(this.lines, data);
  }

  protected substitute(lines: string[], data: any): string[] {
    return this.fold(
      lines.map((line: string) => (
        this.substitutor.substitute(line, data, (line: any, match: MatchedPlaceholder, data: S[keyof S]) => {
          let multi = typeof line !== 'string';

          if (typeof data === 'object') {
            return this.fold(
              Object.keys(data).map((key) => {
                return this.substitute(multi ? line : [line], {
                  [match.key]: data[key],
                });
              })
            );
          }

          return multi
            ? line.map((line) => (
              line.substr(0, match.open) + String(data) + line.substr(match.close)
            ))
            : line.substr(0, match.open) + String(data) + line.substr(match.close);
        })
      ))
    )
  }

  protected fold(a: (string|string[])[]): string[] {
    return a.reduce((r: any[], element: string|string[]) => {
      return r.concat(
        (typeof element === 'string')
          ? [element]
          : element
      );
    }, [])
  }
}
