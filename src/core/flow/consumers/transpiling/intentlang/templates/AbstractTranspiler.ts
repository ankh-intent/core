
import { Compiler } from '../../compiler/Compiler';
import { TemplateInterface } from '../../compiler/TemplateInterface';
import { Strings } from '../../../../../../intent-utils/Strings';

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

  public keyed(data): string[] {
    return Strings.fold(
      Object
        .keys(data)
        .map((name: string) => this.transpile(data[name]))
    );
  }

  protected resolve(data: any, key): any {
    return (data && data.hasOwnProperty(key))
      ? data[key]
      : null;
  }
}
