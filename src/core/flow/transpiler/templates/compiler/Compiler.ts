
import { TemplateFactoryInterface, TemplateInterface } from './TemplateInterface';
import { Sampler } from './Sampler';

export class Compiler<S, R> {
  private sampler: Sampler;
  private factory: TemplateFactoryInterface<S, R>;

  public constructor(sampler: Sampler, factory?: TemplateFactoryInterface<S, R>) {
    this.sampler = sampler;
    this.factory = factory;
  }

  public compile(code: string): (string|TemplateInterface<S, R>)[] {
    let cleaned = this.cleanup(code);
    let compiled = cleaned.map((line) => {

      return (this.sampler.next(line, 0) && this.factory)
        ? this.factory(line)
        : line;

    });

    return compiled;
  }

  private cleanup(code: string): string[] {
    return code
      ? code
        .replace(/(^[\n\r]|\s+$)/g, '')
        .split('\n')
        .map(String)
      : []
    ;
  }
}
