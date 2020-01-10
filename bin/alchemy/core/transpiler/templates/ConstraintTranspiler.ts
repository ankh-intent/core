import { Container } from '@intent/utils';
import { AbstractTranspiler, TranspilerInterface } from '@intent/kernel/transpiler';

import { ConstraintNode } from '../ast';
import { CanTranspiler } from './CanTranspiler';

export class ConstraintTranspiler extends AbstractTranspiler<ConstraintNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    can: new CanTranspiler(this.compiler),
  };

  protected get code(): string {
    return `{%can%}`;
  }
}
