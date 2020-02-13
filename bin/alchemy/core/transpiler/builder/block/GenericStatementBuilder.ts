import { TypedTokenMatcherInterface } from '@intent/parser';

import {
  StatementNode,
  AssignmentStatementNode,
  ExpressionStatementNode,
  ExpressionNode,
} from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type GenericStatementChildren = {
  assignment_statement: AssignmentStatementNode;
  expression: ExpressionNode;
};

export class GenericStatementBuilder extends BaseBuilder<StatementNode, GenericStatementChildren> {
  protected build(tokens, { peek, not, get, ensure }: TypedTokenMatcherInterface) {
    if (peek.identifier('let')) {
      return this.child.assignment_statement(tokens);
    }

    return new ExpressionStatementNode(
      this.child.expression(tokens),
    );
  }
}
