
import { AbstractTranspiler, TranspilerInterface } from '../../../core/consumers/interpreting/transpiler/AbstractTranspiler';
import { ConstraintNode } from '../ast/ConstraintNode';
import { CanTranspiler } from './CanTranspiler';
import { Container } from '../../../intent-utils/Container';

export class ConstraintTranspiler extends AbstractTranspiler<ConstraintNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    can: new CanTranspiler(this.compiler),
  };

  protected get code(): string {
    return `{%can%}`;
  }
}
