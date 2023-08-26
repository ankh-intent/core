import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/parser';

import { PrimitiveNode, PrimitiveType } from '../../../ast';
import { BaseBuilder } from '../../BaseBuilder';

export type LiteralChildren = {};

export class LiteralBuilder extends BaseBuilder<PrimitiveNode, LiteralChildren> {
    protected build(_tokens: TokenMatcher, { get }: TypedTokenMatcherInterface) {
        let value;

        if ((value = get.string())) {
            return new PrimitiveNode(
                value,
                PrimitiveType.String,
            );
        }

        if ((value = get.number())) {
            return new PrimitiveNode(
                value,
                PrimitiveType.Number,
            );
        }

        return null;
    }
}
