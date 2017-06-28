
import { Compiler } from '../../compiler/Compiler';
import { TemplateInterface } from '../../compiler/TemplateInterface';

export abstract class AbstractTranspiler<S> {
  private _template: TemplateInterface<S, string[]>;
  private compiler: Compiler<any, string[]>;

  public constructor(compiler: Compiler<any, string[]>) {
    this.compiler = compiler;
  }

  protected abstract get code(): string;

  protected get template(): TemplateInterface<S, string[]> {
    if (!this._template) {
      this._template = this.compiler.compile(this.code);
    }

    return this._template;
  }

  public transpile(data: S): string[] {
    return this.template.apply(data);
  }
}
