import { TypedTokenMatcherInterface } from '@intent/parser';

import { BreakType, BreakStatementNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type BreakStatementChildren = {};

export class BreakStatementBuilder extends BaseBuilder<BreakStatementNode, BreakStatementChildren> {
    protected build(tokens, { peek, not, get, ensure }: TypedTokenMatcherInterface) {
        if (get.identifier('continue')) {
            return new BreakStatementNode(BreakType.Continue);
        }

        ensure.identifier('break');
        return new BreakStatementNode(BreakType.Break);
    }
}
