
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
