import { Container } from '@intent/kernel';
import { TreeNode } from '@intent/kernel';
import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { OperationNode, ExpressionNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type OperableChildren = {
    operation: OperationNode;
}

export abstract class OperableBuilder<C extends Container<TreeNode>> extends BaseBuilder<ExpressionNode, C & OperableChildren> {
    operands: string[];

    protected abstract buildBase(tokens: TokenMatcher): ExpressionNode;

    protected build(tokens: TokenMatcher, { peek }: TypedTokenMatcherInterface) {
        const base = this.buildBase(tokens);
        const operations: OperationNode[] = [];

        while (this.operands.includes(peek.symbol()!)) {
            operations.push(this.child.operation(tokens));
        }

        if (operations.length) {
            return new ExpressionNode(
                base,
                operations,
            );
        }

        return base;
    }
}
