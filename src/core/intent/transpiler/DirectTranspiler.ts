
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { Substitutor } from '../../flow/transpiler/templates/Substitutor';
import { TemplateVisitors } from '../../flow/transpiler/templates/TemplateVisitors';

export class DirectTranspiler extends AbstractCompoundTemplate<any> {
  private property: string;

  public get code(): string {
    return `{%.${this.property}%}`;
  }

  public constructor(substitutor: Substitutor<any>, visitors: TemplateVisitors<any>, property: string) {
    super(substitutor, visitors);
    this.property = property;

    visitors.bridge(this, ["." + this.property]);
  }

  public resolve(data: any, property: string) {
    return data;
  }
}
