import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { QualifierNode } from '@alchemy/ast';
import { BaseBuilder } from '../BaseBuilder';

export type QualifierChildren = {
    qualifier: QualifierNode;
};

export class QualifierBuilder extends BaseBuilder<QualifierNode, QualifierChildren> {
    protected build(tokens: TokenMatcher, { get, ensure }: TypedTokenMatcherInterface) {
        const value = ensure.identifier();

        return new QualifierNode(
            value,
            get.symbol('.') ? this.child.qualifier(tokens) : null,
        );
    }
}
