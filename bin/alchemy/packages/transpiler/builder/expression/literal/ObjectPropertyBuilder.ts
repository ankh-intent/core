import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ObjectPropertyNode, ExpressionNode } from '@alchemy/ast';
import { BaseBuilder } from '../../BaseBuilder';

export type ObjectPropertyChildren = {
    object_property: ObjectPropertyNode;
    expression: ExpressionNode;
};

export class ObjectPropertyBuilder extends BaseBuilder<ObjectPropertyNode, ObjectPropertyChildren> {
    protected build(tokens: TokenMatcher, { ensure }: TypedTokenMatcherInterface) {
        const identifier = ensure.identifier();
        ensure.symbol(':');
        const expression = this.child.expression(tokens);

        return new ObjectPropertyNode(
            identifier,
            expression,
        );
    }
}
