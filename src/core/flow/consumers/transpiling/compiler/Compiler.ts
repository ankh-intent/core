
import { TemplateFactoryInterface, TemplateInterface } from './TemplateInterface';
import { Sampler } from './Sampler';
import { CompoundTemplate } from '../CompoundTemplate';

export class Compiler<S, R> {
  private sampler: Sampler;
  private factory: TemplateFactoryInterface<S, R>;

  public constructor(sampler: Sampler, factory?: TemplateFactoryInterface<S, R>) {
    this.sampler = sampler;
    this.factory = factory;
  }

  public compileLines(code: string): (string|TemplateInterface<S, R>)[] {
    let cleaned = this.cleanup(code);
    let compiled = cleaned.map((line) => {

      return (this.sampler.next(line, 0) && this.factory)
        ? this.factory(line)
        : line;

    });

    return compiled;
  }

  public compile(code: string): TemplateInterface<S, R> {
    return new CompoundTemplate<S, R>(
      this.compileLines(code)
    );
  }

  private cleanup(code: string): string[] {
    return code
      ? this.normalize(
          code
            .replace(/(^[\n\r]+|\s+$)/g, '')
            .split('\n')
            .map(String)
        )
      : []
    ;
  }

  public normalize(lines: string[]): string[] {
    for (let line of lines) {
      if (line.trim() === "") {
        continue;
      }

      let match = line.match(/^(\s+)/);

      if (!match) {
        break;
      }

      let whitespace = match[1];

      return lines.map((line: string) => (
        line.startsWith(whitespace)
          ? line.substr(whitespace.length)
          : line
      ));
    }

    return lines;
  }
}
