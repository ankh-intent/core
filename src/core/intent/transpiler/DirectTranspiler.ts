
import { AbstractCompoundTemplate } from "../../flow/transpiler/templates/CompoundTemplate";
import { Substitutor } from '../../flow/transpiler/templates/Substitutor';
import { TemplateVisitors } from '../../flow/transpiler/templates/TemplateVisitors';

export class DirectTranspiler extends AbstractCompoundTemplate<any> {
  private name: string;

  public constructor(substitutor: Substitutor<any>, visitors: TemplateVisitors<any>, name: string) {
    super(substitutor, visitors);
    this.name = name;
  }

  public get code(): string {
    return `{%${this.name}%}`;
  }

  public apply(data) {
    return data;
  }
}
