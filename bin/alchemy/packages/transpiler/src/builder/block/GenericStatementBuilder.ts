import { TokenMatcher } from '@intent/kernel';

import { StatementNode, AssignmentStatementNode, ExpressionStatementNode } from '@alchemy/ast';
import { BaseBuilder, Markers } from '../BaseBuilder';

export type GenericStatementChildren = {
    assignment_statement: AssignmentStatementNode;
    expression_statement: ExpressionStatementNode;
};

export class GenericStatementBuilder extends BaseBuilder<StatementNode, GenericStatementChildren> {
    protected build(tokens: TokenMatcher) {
        let assignment = tokens.marked(Markers.ASSIGNMENT, this.child.assignment_statement);

        if (assignment) {
            return assignment;
        }

        return this.child.expression_statement(tokens);
    }
}
