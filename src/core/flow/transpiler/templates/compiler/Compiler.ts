import { Sampler } from "../../Sampler";
import { TemplateInterface } from './TemplateInterface';

export class Compiler {
  private sampler: Sampler;

  public constructor(sampler: Sampler) {
    this.sampler = sampler;
  }

  public compile(code: string): string[] {
    let cleaned = this.cleanup(code);

    let compiled = cleaned.map((line) => {

      return this.sampler.next(line, 0)
        ? new TemplateInterface()
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
