import { Container } from '@intent/utils';
import { AbstractTranspiler, TranspilerInterface } from '@intent/kernel/transpiler';

import { CanNode } from '../ast';
import { FunctionTranspiler } from './FunctionTranspiler';

export class CanTranspiler extends AbstractTranspiler<CanNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    func: new FunctionTranspiler(this.compiler),
  };

  protected get code(): string {
    return `
      {%name%}{%func%}
    `;
  }
}
