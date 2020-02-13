import { Container } from '@intent/utils';
import { AbstractTranspiler, TranspilerInterface } from '@intent/kernel/transpiler';

import { ModuleNode } from '../ast';
import { DomainTranspiler } from './DomainTranspiler';
import { UseTranspiler } from './UseTranspiler';

export class ModuleTranspiler extends AbstractTranspiler<ModuleNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    uses: new UseTranspiler(this.compiler),
    domain: new DomainTranspiler(this.compiler),
  };

  protected get code(): string {
    return `
      ((Alchemy) => {
        {%*uses%}
        {%domain%}
      })(window['Alchemy']);
    `;
  }
}
