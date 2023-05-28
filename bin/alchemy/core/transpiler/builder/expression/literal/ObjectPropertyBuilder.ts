import { TypedTokenMatcherInterface } from '@intent/parser';

import { ObjectPropertyNode, ExpressionNode } from '../../../ast';
import { BaseBuilder } from '../../BaseBuilder';

export type ObjectPropertyChildren = {
    object_property: ObjectPropertyNode;
    expression: ExpressionNode;
};

export class ObjectPropertyBuilder extends BaseBuilder<ObjectPropertyNode, ObjectPropertyChildren> {
    protected build(tokens, { get, peek, ensure }: TypedTokenMatcherInterface) {
        const identifier = ensure.identifier();
        ensure.symbol(':');
        const expression = this.child.expression(tokens);

        return new ObjectPropertyNode(
            identifier,
            expression,
        );
    }
}
