import { Container } from '@intent/utils/Container';
import { AbstractTranspiler, TranspilerInterface } from '@intent/kernel/transpiler/AbstractTranspiler';

import { ModuleNode } from '../ast/ModuleNode';

export class ModuleTranspiler extends AbstractTranspiler<ModuleNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
  };

  protected get code(): string {
    return `
      ((intent) => { 
        {%*uses%}
        {%*domains%}
      
        return {
          {%names%},
          {%can%}
        };
      })(window.Intent);
    `;
  }
}
