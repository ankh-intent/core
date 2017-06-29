
import { Compiler } from '../../compiler/Compiler';
import { TemplateInterface } from '../../compiler/TemplateInterface';

export abstract class AbstractTranspiler<S> {
  private _template: TemplateInterface<S, string[]>;
  protected compiler: Compiler<any, string[]>;

  public constructor(compiler: Compiler<any, string[]>) {
    this.compiler = compiler;
  }

  protected abstract get code(): string;

  protected get template(): TemplateInterface<S, string[]> {
    if (!this._template) {
      this._template = this.compiler.compile(
        this.code,
        this.resolve.bind(this)
      );
    }

    return this._template;
  }

  public transpile(data: S): string[] {
    return this.template.apply(data);
  }

  protected resolve(data: any, key): any {
    return (data && data.hasOwnProperty(key))
      ? data[key]
      : null;
  }
}
