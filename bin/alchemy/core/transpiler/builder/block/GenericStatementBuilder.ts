import { TokenMatcher } from '@intent/parser';

import { StatementNode, AssignmentStatementNode, ExpressionStatementNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type GenericStatementChildren = {
    assignment_statement: AssignmentStatementNode;
    expression_statement: ExpressionStatementNode;
};

export class GenericStatementBuilder extends BaseBuilder<StatementNode, GenericStatementChildren> {
    protected build(tokens: TokenMatcher) {
        let assignment = this.lookup('IS_ASSIGNMENT', tokens, this.child.assignment_statement);

        if (assignment) {
            return assignment;
        }

        return this.child.expression_statement(tokens);
    }
}
