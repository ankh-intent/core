import { Container } from '@intent/utils';
import { AbstractTranspiler, TranspilerInterface } from '@intent/kernel/transpiler';

import { FunctorNode } from '../ast';
import { TypeTranspiler } from './TypeTranspiler';
import { PropertyTranspiler } from './PropertyTranspiler';

export class FunctionTranspiler extends AbstractTranspiler<FunctorNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    returns: new TypeTranspiler(this.compiler),
    args: new PropertyTranspiler(this.compiler),
  };

  protected get code(): string {
    return `
      ({%*args|.join(", ")%}): {%returns|.pop()||'any'%} {
        {%body%}
      }`;
  }

  public resolve(data: FunctorNode, key: string): any {
    switch (key) {
      case 'body':
        return data.body.body.trim().split('\n');
    }

    return super.resolve(data, key);
  }
}
