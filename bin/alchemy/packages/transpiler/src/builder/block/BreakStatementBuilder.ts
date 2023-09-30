import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { BreakType, BreakStatementNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type BreakStatementChildren = {};

export class BreakStatementBuilder extends BaseBuilder<BreakStatementNode, BreakStatementChildren> {
    protected build(_tokens: TokenMatcher, { get, ensure }: TypedTokenMatcherInterface) {
        if (get.identifier('continue')) {
            return new BreakStatementNode(BreakType.Continue);
        }

        ensure.identifier('break');
        return new BreakStatementNode(BreakType.Break);
    }
}
