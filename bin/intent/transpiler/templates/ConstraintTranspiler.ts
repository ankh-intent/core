import { AbstractTranspiler, TranspilerInterface } from '~kernel/transpiler/AbstractTranspiler';

import { ConstraintNode } from '../ast/ConstraintNode';
import { CanTranspiler } from './CanTranspiler';
import { Container } from '../../../../src/core/utils/Container';

export class ConstraintTranspiler extends AbstractTranspiler<ConstraintNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    can: new CanTranspiler(this.compiler),
  };

  protected get code(): string {
    return `{%can%}`;
  }
}
