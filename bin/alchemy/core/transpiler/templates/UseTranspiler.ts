import { AbstractTranspiler, TranspilerInterface } from '@intent/kernel/transpiler';
import { Container } from '@intent/utils';

import { UseNode, DecompositionNode } from '../ast';

export class UseTranspiler extends AbstractTranspiler<UseNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    decomposition: new DecompositionTranspiler(this.compiler),
  };

  protected get code(): string {
    return `const { {%@decomposition%} } = <any>{%qualifier%};`;
  }

  public resolve(data: UseNode, key: string): any {
    switch (key) {
      case 'qualifier':
        return data.decomposition.qualifier.path();
    }

    return super.resolve(data, key);
  }
}

export class DecompositionTranspiler extends AbstractTranspiler<DecompositionNode> {
  protected get code(): string {
    return `
      {%alias%}{%*children%}
    `;
  }

  public resolve(data: DecompositionNode, key: string): any {
    switch (key) {
      case 'children':
        if (Object.values(data.children).length) {
          return `: {${Object.values(data.children).map((child) => this.transpile(child)).join(',')}}`;
        } else {
          return null;
        }
    }

    return super.resolve(data, key);
  }
}
