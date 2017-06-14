
import { DomainNode } from '../ast/DomainNode';
import { AbstractCompoundTemplate } from '../../flow/transpiler/templates/CompoundTemplate';

export class DomainTranspiler extends AbstractCompoundTemplate<DomainNode> {
  public get code(): string {
    return `
      let {%=identifier%} = () => {
        {%typedefs%}
      
        const I = {
          ingredient: intent.type(Ingredient),
        };
      
        return {
          {%=typeref%},
        };
      };`;
  }

  public resolve(data: DomainNode, property: string) {
    switch (property) {
      case "typeref":
        return data.types;
    }

    return data[property];
  }
}
