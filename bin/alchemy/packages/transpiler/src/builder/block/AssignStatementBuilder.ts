import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { AssignmentStatementNode, ExpressionNode, AssignmentTargetNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type AssignStatementChildren = {
    assignment_target: AssignmentTargetNode;
    expression: ExpressionNode;
};

const OPS = ['=', '+=', '-=', '/=', '*=', '%=', '**=', '|=', '&=', '^='];

export class AssignStatementBuilder extends BaseBuilder<AssignmentStatementNode, AssignStatementChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        const target = this.child.assignment_target(tokens);
        const operator = ensure.symbol();

        if (!OPS.includes(operator)) {
            throw this.error(tokens, target, `Expected assignment operator, got "${operator}"`);
        }

        this.setAssignment(tokens);

        const expression = this.child.expression(tokens);

        return new AssignmentStatementNode(
            target,
            operator,
            expression,
        );
    }
}
