import { TypedTokenMatcherInterface } from '@intent/parser';

import { OperationNode, ExpressionNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type OperationChildren = {
    expression: ExpressionNode;
}

export class OperationBuilder extends BaseBuilder<OperationNode, OperationChildren> {
    protected build(tokens, { ensure }: TypedTokenMatcherInterface) {
        const operation = ensure.symbol();
        const expression = this.child.expression(tokens);

        return new OperationNode(
            operation,
            expression,
            true,
        );
    }
}
