
import { Compiler } from '../../compiler/Compiler';
import { TemplateInterface } from '../../compiler/TemplateInterface';
import { Strings } from '../../../../../../intent-utils/Strings';
import { Container } from '../../../../../../intent-utils/Container';

export interface TranspilerInterface<S> {
  transpile(data: S): string[];
  keyed(data: any): string[];
}

export abstract class AbstractTranspiler<S> implements TranspilerInterface<S> {
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
          let [property, modifier, filters] = this.modifiers(key);
          let resolved = data && this.resolve(data, property);
          let transpiler = this.visitors[property];

          if (!(transpiler && resolved !== undefined)) {
            return resolved !== undefined ? resolved : null;
          }

          if (modifier) {
            if (modifier.indexOf('*') < 0) {
              resolved = transpiler.transpile(resolved);
            } else {
              resolved = resolved ? transpiler.keyed(resolved) : [];
            }
          } else {
            resolved = transpiler.transpile(resolved);
          }

          if (filters) {
            resolved = eval('resolved' + filters);
          }

          return resolved;
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

  protected modifiers(key: string): [string, string, string] {
    let m = key.match(/^([+\-*.=?]+)/);
    let modifiers: string = null;
    let filters: string = null;

    if (m) {
      modifiers = m[1];
      key = key.substr(modifiers.length);
    }

    m = key.match(/\|(.*)$/);

    if (m) {
      filters = m[1];
      key = key.substr(0, key.length - filters.length - 1);
    }

    return [key, modifiers, filters];
  }
}
