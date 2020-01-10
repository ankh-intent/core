import { Container } from '@intent/utils';
import { AbstractTranspiler, TranspilerInterface } from '@intent/kernel/transpiler/AbstractTranspiler';

import { CanNode } from '../ast';
import { TypeTranspiler } from './TypeTranspiler';
import { PropertyTranspiler } from './PropertyTranspiler';

export class CanTranspiler extends AbstractTranspiler<CanNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    returns: new TypeTranspiler(this.compiler),
    args: new PropertyTranspiler(this.compiler),
  };

  protected get code(): string {
    return `
      {%name%}({%*args|.join(", ")%}): {%returns|.pop()||'any'%} {
        {%body%}
      }`;
  }

  public resolve(data: CanNode, key: string): any {
    switch (key) {
      case 'body':
        return data.body.trim().split('\n');
    }

    return super.resolve(data, key);
  }
}
