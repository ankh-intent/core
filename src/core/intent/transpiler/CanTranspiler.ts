
import { CanNode } from "../ast/CanNode";
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { Substitutor } from '../../flow/transpiler/templates/Substitutor';
import { TemplateVisitors } from '../../flow/transpiler/templates/TemplateVisitors';

export class CanTranspiler extends AbstractCompoundTemplate<CanNode> {
  public get code(): string {
    return `
      {%name%}({%args%})/*: {%returns%}*/ {
        {%body%} 
      }`;
  }

  public constructor(substitutor: Substitutor<CanNode>, visitors: TemplateVisitors<CanNode>) {
    super(substitutor, visitors);

    visitors.bridge(this, ["returns"]);
  }


  public resolve(data: CanNode, property: string) {
    return data[property];
  }
}
