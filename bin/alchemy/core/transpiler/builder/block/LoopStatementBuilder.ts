import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { BlockNode, LoopStatementNode, LoopIteratorNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type LoopStatementChildren = {
    block: BlockNode;
    loop_iterator: LoopIteratorNode;
};

export class LoopStatementBuilder extends BaseBuilder<LoopStatementNode, LoopStatementChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        ensure.identifier('each');
        ensure.symbol('(');

        const iterator = this.child.loop_iterator(tokens);

        ensure.symbol(')');

        const block = this.child.block(tokens);

        return new LoopStatementNode(
            iterator,
            block,
        );
    }
}
