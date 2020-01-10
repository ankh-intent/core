import { AbstractTranspiler } from '@intent/kernel/transpiler';

import { UseNode } from '../ast';

export class UseTranspiler extends AbstractTranspiler<UseNode> {
  protected get code(): string {
    return `const {%alias%} = <any>{}; // {%qualifier%}`;
  }

  public resolve(data: UseNode, key: string): any {
    switch (key) {
      case 'qualifier':
        return data.qualifier.path();
    }

    return super.resolve(data, key);
  }
}
