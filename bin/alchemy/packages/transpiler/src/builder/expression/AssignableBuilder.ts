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
            const index = tokens.current();
            const state = tokens.pushState();

            let call = peek.symbol('(') && this.child.call(tokens);
            let operation: OperationNode | null = null;

            if (peek.symbol('.')) {
                operation = this.child.chain(tokens);
            } else if (peek.symbol('[')) {
                operation = this.child.indexed(tokens);
            }

            tokens.popState(state);

            if (call) {
                if (operation) {
                    operations.push(call);
                } else {
                    tokens.goto(index);
                }
            }

            if (operation) {
                operations.push(operation);
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
