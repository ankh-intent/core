import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { BlockNode, LoopStatementNode, LoopIteratorNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type LoopStatementChildren = {
    block_expression: BlockNode;
    loop_iterator: LoopIteratorNode;
};

export class LoopStatementBuilder extends BaseBuilder<LoopStatementNode, LoopStatementChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        ensure.identifier('each');
        ensure.symbol('(');

        const iterator = this.child.loop_iterator(tokens);

        ensure.symbol(')');

        const block = this.child.block_expression(tokens);

        return new LoopStatementNode(
            iterator,
            block,
        );
    }
}
