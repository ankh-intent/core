import { AbstractNode } from '@intent/kernel';
import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ExpressionNode, OperationNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type AccessorChildren = {
    accessible: AbstractNode;
    chain: OperationNode;
    indexed: OperationNode;
    call: OperationNode;
    is_domain: OperationNode;
    postfix: OperationNode;
};

export class AccessorBuilder extends BaseBuilder<ExpressionNode, AccessorChildren> {
    protected build(tokens: TokenMatcher, { peek }: TypedTokenMatcherInterface) {
        const base = this.child.accessible(tokens);
        const operations: OperationNode[] = [];

        while (true) {
            if (peek.symbol('.')) {
                operations.push(this.child.chain(tokens));
            } else if (peek.symbol('[')) {
                operations.push(this.child.indexed(tokens));
            } else if (peek.symbol('(')) {
                operations.push(this.child.call(tokens));
            } else if (peek.identifier('is')) {
                operations.push(this.child.is_domain(tokens));
            } else if (peek.symbol('--') || peek.symbol('++')) {
                operations.push(this.child.postfix(tokens));
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
