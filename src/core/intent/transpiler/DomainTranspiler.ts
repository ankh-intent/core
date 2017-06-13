
import { DomainNode } from '../ast/DomainNode';
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';
import { Substitutor } from '../../flow/transpiler/templates/Substitutor';
import { TemplateVisitors } from '../../flow/transpiler/templates/TemplateVisitors';

export class DomainTranspiler extends AbstractCompoundTemplate<DomainNode> {
  public get code(): string {
    return `
      let {%.identifier%} = () => {
        {%typedefs%}
      
        const I = {
          ingredient: intent.type(Ingredient),
        };
      
        return {
          {%*typeref%},
        };
      };`;
  }

  public constructor(substitutor: Substitutor<DomainNode>, visitors: TemplateVisitors<DomainNode>) {
    super(substitutor, visitors);

    // visitors.bridge(this, ["typeref"]);
  }


  public resolve(data: DomainNode, property: string) {
    switch (property) {
      case "typeref":
        return data.types;
    }

    return data[property];
  }
}
