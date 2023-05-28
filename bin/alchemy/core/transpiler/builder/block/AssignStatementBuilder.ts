import { TypedTokenMatcherInterface } from '@intent/parser';

import { AssignmentStatementNode, ExpressionNode, AssignmentTargetNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type AssignStatementChildren = {
    assignment_target: AssignmentTargetNode;
    expression: ExpressionNode;
};

const OPS = ['=', '+=', '-=', '/=', '*=', '%=', '**=', '|=', '&=', '^='];

export class AssignStatementBuilder extends BaseBuilder<AssignmentStatementNode, AssignStatementChildren> {
    protected build(tokens, { peek, not, get, ensure }: TypedTokenMatcherInterface) {
        const target = this.child.assignment_target(tokens);
        const operator = ensure.symbol();

        if (!OPS.includes(operator)) {
            throw this.error(tokens, target, `Expected assignment operator, got "${operator}"`);
        }

        tokens.mark('IS_ASSIGNMENT');

        const expression = this.child.expression(tokens);

        return new AssignmentStatementNode(
            target,
            operator,
            expression,
        );
    }
}
