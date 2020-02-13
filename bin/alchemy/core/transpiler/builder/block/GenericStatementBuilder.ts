import { TypedTokenMatcherInterface } from '@intent/parser';

import { StatementNode, AssignmentStatementNode, ExpressionStatementNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type GenericStatementChildren = {
  assignment_statement: AssignmentStatementNode;
  expression_statement: ExpressionStatementNode;
};

export class GenericStatementBuilder extends BaseBuilder<StatementNode, GenericStatementChildren> {
  protected build(tokens, { peek }: TypedTokenMatcherInterface) {
    if (peek.identifier('let')) {
      return this.child.assignment_statement(tokens);
    }

    return this.child.expression_statement(tokens);
  }
}
