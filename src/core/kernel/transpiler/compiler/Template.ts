
import { TemplateInterface } from './TemplateInterface';
import { DataResolver, SubstitutorInterface } from './Substitutor';
import { MatchedPlaceholder } from './SamplerInterface';
import { Strings } from '../../../utils/Strings';

export class Template<S> implements TemplateInterface<S, string[]> {
  private readonly substitutor: SubstitutorInterface<S, string[]>;
  private readonly resolver: DataResolver<S>;
  private readonly line: string;

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
    let str;

    if (data !== null) {
      if (data instanceof Array) {
        return Strings.fold(
          data.map((data) => this.consume(lines, match, data))
        );
      }

      if (typeof data === 'object') {
        return Strings.fold(
          Object.values(data).map((data) => this.consume(lines, match, data))
        );
      }

      if (typeof data === 'object') {
        const name = (data.constructor !== Object) ? data.constructor.name : '<Unresolved>';

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
