import { TypedTokenMatcherInterface } from '@intent/parser';

import { ExpressionStatementNode, ExpressionNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type ExpressionStatementChildren = {
    expression: ExpressionNode;
};

export class ExpressionStatementBuilder extends BaseBuilder<ExpressionStatementNode, ExpressionStatementChildren> {
    protected build(tokens, {}: TypedTokenMatcherInterface) {
        return new ExpressionStatementNode(
            this.child.expression(tokens),
        );
    }
}
