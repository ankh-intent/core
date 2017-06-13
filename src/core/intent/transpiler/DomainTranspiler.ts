
import { DomainNode } from '../ast/DomainNode';
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { Substitutor } from '../../flow/transpiler/templates/Substitutor';
import { TemplateVisitors } from '../../flow/transpiler/templates/TemplateVisitors';

export class DomainTranspiler extends AbstractCompoundTemplate<DomainNode> {
  public get code(): string {
    return `
      let {%identifier%} = () => {
        {%types%}
      
        const I = {
          ingredient: intent.type(Ingredient),
        };
      
        return {
          {%typerefs*%},
        };
      };`;
  }

  public constructor(substitutor: Substitutor<DomainNode>, visitors: TemplateVisitors<DomainNode>) {
    super(substitutor, visitors);

    visitors.bridge(this, ["typerefs"]);
  }


  public resolve(data: DomainNode, property: string) {
    switch (property) {
      case "typerefs":
        return data.types;
    }

    return data[property];
  }
}
