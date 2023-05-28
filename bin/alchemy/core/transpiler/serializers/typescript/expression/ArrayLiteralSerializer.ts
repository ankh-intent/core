import { ArrayNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type ArrayLiteralSerializerChildren = {
    expression: ExpressionNode;
};

export class ArrayLiteralSerializer extends NodeSerializer<ArrayNode, ArrayLiteralSerializerChildren> {
    serialize(node: ArrayNode, context: SerializingContext): string {
        return `[${this.wrapInlineList(node.items.map((item) => this.child.expression(item, context)))}]`;
    }
}
