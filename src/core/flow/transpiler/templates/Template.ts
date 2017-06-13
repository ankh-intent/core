
import { Substitutor } from './Substitutor';
import { TemplateContext } from './TemplateContext';
import { TemplateVisitors } from "./TemplateVisitors";

export abstract class AbstractTemplate<D, R = string> {
  protected visitors: TemplateVisitors<D, any>;
  protected substitutor: Substitutor<D, any>;

  public abstract get code(): string;
  public abstract resolve(data: D, property: string): any;

  public constructor(substitutor: Substitutor<D, any>, visitors: TemplateVisitors<D, any>) {
    this.substitutor = substitutor;
    this.visitors = visitors;
  }

  public getVisitors(): TemplateVisitors<D, any> {
    return this.visitors;
  }

  public getSubstitutor(): Substitutor<D, any> {
    return this.substitutor;
  }

  public apply(data: D): R[] {
    return this.flatten(
      this.substitutor.substitute(
        <any>new TemplateContext(
          this,
          data,
          this.code
        )
      )
    );
  }

  protected flatten(a: any[]): R[] {
    return a.reduce((lines: R[], line: R|R[]) => (
      lines.concat(
        (line instanceof Array)
          ? line
          : <any>String(line).split("\n")
      )
    ), <R[]>[]);
  }
}

export class Template<D, R = string> extends AbstractTemplate<D, R> {
  public code: string;
  public parent: AbstractTemplate<D, R>;

  public constructor(parent: AbstractTemplate<D, R>, code: string) {
    super(parent.getSubstitutor(), parent.getVisitors());
    this.parent = parent;
    this.code = code;
  }

  public resolve(data: D, property: string) {
    return this.parent.resolve(data, property);
  }
}
