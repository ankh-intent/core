import { TypedTokenMatcherInterface, TokenMatcher } from '@intent/kernel';

import { ObjectPropertyNode, ExpressionNode, IdentifierNode } from '@alchemy/ast';
import { BaseBuilder } from '../../BaseBuilder';

export type ObjectPropertyChildren = {
    object_property: ObjectPropertyNode;
    expression: ExpressionNode;
    identifier: IdentifierNode;
};

export class ObjectPropertyBuilder extends BaseBuilder<ObjectPropertyNode, ObjectPropertyChildren> {
    protected build(tokens: TokenMatcher, { ensure, peek }: TypedTokenMatcherInterface) {
        const identifier = this.child.identifier(tokens);
        let expression: ExpressionNode;

        if (!peek.symbol(':')) {
            expression = new ExpressionNode(identifier);
            expression.astRegion = identifier.astRegion;
        } else {
            ensure.symbol(':');
            expression = this.child.expression(tokens);
        }

        return new ObjectPropertyNode(
            identifier.name,
            expression,
        );
    }
}
