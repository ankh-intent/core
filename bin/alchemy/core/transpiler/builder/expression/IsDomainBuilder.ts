import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { IsDomainNode, ReferenceNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type IsDomainChildren = {
    type: ReferenceNode;
};

export class IsDomainBuilder extends BaseBuilder<IsDomainNode, IsDomainChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        ensure.identifier('is');

        return new IsDomainNode(this.child.type(tokens));
    }
}
