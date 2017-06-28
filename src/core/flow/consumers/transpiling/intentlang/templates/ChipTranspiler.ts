
import { AbstractTranspiler } from './AbstractTranspiler';
import { ChipNode } from '../../../../../intent/ast/ChipNode';
import { DomainTranspiler } from './DomainTranspiler';

export class ChipTranspiler extends AbstractTranspiler<ChipNode> {
  private domain = new DomainTranspiler(this.compiler);

  protected get code(): string {
    return `
      ((intent) => { 
        {%*domains%}
        {%can%}
      
        return {
          {%*names%},
        };
      })(window.Intent);
    `;
  }

  public resolve(data: any, key: string): any {
    switch (key) {
      case '*names':
        return Object.keys(data.domains);

      case '*domains':
        return Object.keys(data.domains)
          .map((name) => this.domain.transpile(data.domains[name]))
        ;
    }

    return super.resolve(data, key);
  }
}
