
import { Compiler } from '../../compiler/Compiler';
import { TemplateInterface } from '../../compiler/TemplateInterface';
import { Strings } from '../../../../../../intent-utils/Strings';
import { Container } from '../../../../transpiler/Container';

export interface TranspilerInterface<S> {
  transpile(data: S): string[];
  keyed(data: any): string[];
}

export abstract class AbstractTranspiler<S> {
  private _template: TemplateInterface<S, string[]>;
  protected compiler: Compiler<any, string[]>;
  protected visitors: Container<TranspilerInterface<any>> = {};

  public constructor(compiler: Compiler<any, string[]>) {
    this.compiler = compiler;
  }

  protected abstract get code(): string;

  protected get template(): TemplateInterface<S, string[]> {
    if (!this._template) {
      this._template = this.compiler.compile(
        this.code,
        (data: S, key: string) => {
          let [property, modifier] = this.modifiers(key);
          let resolved = this.resolve(data, property);

          let transpiler = this.visitors[key];

          if (!transpiler) {
            return resolved;
          }

          switch (modifier) {
            case '*':
              return transpiler.keyed(resolved);

            default:
              return transpiler.transpile(resolved);
          }
        }
      );
    }

    return this._template;
  }

  public transpile(data: S): string[] {
    return this.template.apply(data);
  }

  public keyed(data: any): string[] {
    return Strings.fold(
      this.values(data)
        .map((element: any) => this.transpile(element))
    );
  }

  protected values(data: any): any[] {
    return Object
      .keys(data)
      .map((name: string) => data[name])
    ;
  }

  protected resolve(data: any, key): any {
    return (data && data.hasOwnProperty(key))
      ? data[key]
      : null;
  }

  protected modifiers(key: string): [string, string] {
    let m = key.match(/^([+\-*.=?]+)/);
    let modifiers: string = null;

    if (m) {
      modifiers = m[1];
      key = key.substr(modifiers.length);
    }

    return [key, modifiers];
  }
}
