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

    protected abstract buildBase(tokens: TokenMatcher, matchers: TypedTokenMatcherInterface): ExpressionNode;

    protected consumeOperation(tokens: TokenMatcher, { peek }: TypedTokenMatcherInterface): OperationNode | undefined | null {
        if (this.operands.includes(peek.symbol()!)) {
            return this.child.operation(tokens);
        }
    }

    protected build(tokens: TokenMatcher, matchers: TypedTokenMatcherInterface) {
        const base = this.buildBase(tokens, matchers);
        let operations: OperationNode[] = [];
        let node: OperationNode | undefined | null;

        while ((node = this.consumeOperation(tokens, matchers))) {
            operations.push(node);
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
