
import { AbstractTranspiler } from './AbstractTranspiler';
import { ChipNode } from '../../../../../intent/ast/ChipNode';
import { DomainTranspiler } from './DomainTranspiler';
import { CanTranspiler } from './CanTranspiler';
import { UseTranspiler } from './UseTranspiler';

export class ChipTranspiler extends AbstractTranspiler<ChipNode> {
  private domain = new DomainTranspiler(this.compiler);
  private use = new UseTranspiler(this.compiler);
  private can = new CanTranspiler(this.compiler);

  protected get code(): string {
    return `
      ((intent) => { 
        {%uses%}
        {%domains%}
        {%can%}
      
        return {
          {%names%},
        };
      })(window.Intent);
    `;
  }

  public resolve(data: ChipNode, key: string): any {
    switch (key) {
      case 'uses':
        return this.use.keyed(data.uses);

      case 'names':
        return Object.keys(data.domains);

      case 'domains':
        return Object.keys(data.domains)
          .map((name) => this.domain.transpile(data.domains[name]))
        ;

      case 'can':
        return data.can && this.can.transpile(data.can);
    }

    return super.resolve(data, key);
  }
}
