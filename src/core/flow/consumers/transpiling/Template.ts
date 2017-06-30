
import { TemplateInterface } from './compiler/TemplateInterface';
import { DataResolver, SubstitutorInterface } from './Substitutor';
import { MatchedPlaceholder } from './compiler/SamplerInterface';
import { Strings } from '../../../../intent-utils/Strings';

export class Template<S> implements TemplateInterface<S, string[]> {
  private substitutor: SubstitutorInterface<S, string[]>;
  private resolver: DataResolver<S>;
  private line: string;

  public constructor(line: string, substitutor: SubstitutorInterface<S, string[]>, resolver: DataResolver<S>) {
    this.line = line;
    this.substitutor = substitutor;
    this.resolver = resolver;
    this.consume = this.consume.bind(this);
  }

  public apply(data: S): string[] {
    return Strings.fold(
      this.substitutor.substitute(
        this.line,
        data,
        this.consume,
        this.resolver
      )
    );
  }

  protected consume(lines: string|string[], match: MatchedPlaceholder, data: any): string[] {
    if (data instanceof Array) {
      return Strings.fold(
        data.map((data) => this.consume(lines, match, data))
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
      str = '';
    }

    return (
      (typeof lines === 'string')
        ? [
            lines.substr(0, match.open) + str + lines.substr(match.close)
          ]
        : lines.map((line: string) => (
            line.substr(0, match.open) + str + line.substr(match.close)
          ))
    );
  }
}
