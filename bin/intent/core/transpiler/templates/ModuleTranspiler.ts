import { Container } from '@intent/utils';
import { AbstractTranspiler, TranspilerInterface } from '@intent/kernel/transpiler';

import { ModuleNode } from '../ast';

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
