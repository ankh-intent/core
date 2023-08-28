import { AbstractNode } from '@intent/kernel';
import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ExpressionNode, OperationNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type AssignableChildren = {
    accessible: AbstractNode;
    chain: OperationNode;
    indexed: OperationNode;
    call: OperationNode;
    postfix: OperationNode;
};

export class AssignableBuilder extends BaseBuilder<ExpressionNode, AssignableChildren> {
    protected build(tokens: TokenMatcher, { peek }: TypedTokenMatcherInterface) {
        const base = this.child.accessible(tokens);
        const operations: OperationNode[] = [];

        while (true) {
            if (peek.symbol('(')) {
                operations.push(this.child.call(tokens));
            }

            if (peek.symbol('.')) {
                operations.push(this.child.chain(tokens));
            } else if (peek.symbol('[')) {
                operations.push(this.child.indexed(tokens));
            } else {
                break;
            }
        }

        return new ExpressionNode(
            base,
            operations,
        );
    }
}
