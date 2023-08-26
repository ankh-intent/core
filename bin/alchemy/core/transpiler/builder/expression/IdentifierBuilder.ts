import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { IdentifierNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type IdentifierChildren = {};

export class IdentifierBuilder extends BaseBuilder<IdentifierNode, IdentifierChildren> {
    protected build(_tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        return new IdentifierNode(ensure.identifier());
    }
}
