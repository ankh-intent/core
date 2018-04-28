
import { AbstractTranspiler, TranspilerInterface } from '../../transpiler/AbstractTranspiler';
import { ChipNode } from '../../intent/ast/ChipNode';
import { DomainTranspiler } from './DomainTranspiler';
import { CanTranspiler } from './CanTranspiler';
import { UseTranspiler } from './UseTranspiler';
import { Container } from '../../../../../intent-utils/Container';

export class ChipTranspiler extends AbstractTranspiler<ChipNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    uses: new UseTranspiler(this.compiler),
    domains: new DomainTranspiler(this.compiler),
    can: new CanTranspiler(this.compiler),
  };

  protected get code(): string {
    return `
      ((intent) => { 
        {%*uses%}
        {%*domains%}
        {%can%}
      
        return {
          {%names%},
        };
      })(window.Intent);
    `;
  }

  public resolve(data: ChipNode, key: string): any {
    switch (key) {
      case 'names':
        return Object.keys(data.domains);
    }

    return super.resolve(data, key);
  }
}
