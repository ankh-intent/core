
import { AbstractTranspiler, TranspilerInterface } from '../../transpiler/AbstractTranspiler';
import { ConstraintNode } from '../../intent/ast/ConstraintNode';
import { CanTranspiler } from './CanTranspiler';
import { Container } from '../../../../../intent-utils/Container';

export class ConstraintTranspiler extends AbstractTranspiler<ConstraintNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    can: new CanTranspiler(this.compiler),
  };

  protected get code(): string {
    return `{%can%}`;
  }
}
