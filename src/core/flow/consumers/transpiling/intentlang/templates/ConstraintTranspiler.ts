
import { AbstractTranspiler, TranspilerInterface } from './AbstractTranspiler';
import { ConstraintNode } from '../../../../../intent/ast/ConstraintNode';
import { CanTranspiler } from './CanTranspiler';
import { Container } from '../../../../transpiler/Container';

export class ConstraintTranspiler extends AbstractTranspiler<ConstraintNode> {
  protected visitors: Container<TranspilerInterface<any>> = {
    can: new CanTranspiler(this.compiler),
  };

  protected get code(): string {
    return `{%can%}`;
  }
}
