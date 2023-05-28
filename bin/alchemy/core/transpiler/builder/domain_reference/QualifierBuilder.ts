import { TypedTokenMatcherInterface } from '@intent/parser';

import { QualifierNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type QualifierChildren = {
    qualifier: QualifierNode;
};

export class QualifierBuilder extends BaseBuilder<QualifierNode, QualifierChildren> {
    protected build(tokens, { get, ensure }: TypedTokenMatcherInterface) {
        const value = ensure.identifier();

        return new QualifierNode(
            value,
            get.symbol('.') ? this.child.qualifier(tokens) : null,
        );
    }
}
