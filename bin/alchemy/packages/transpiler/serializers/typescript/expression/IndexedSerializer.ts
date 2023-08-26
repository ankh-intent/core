import { IndexedNode, ExpressionNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type IndexedSerializerChildren = {
    expression: ExpressionNode;
};

export class IndexedSerializer extends NodeSerializer<IndexedNode, IndexedSerializerChildren> {
    serialize(node: IndexedNode, context: SerializingContext): string {
        return `[${this.child.expression(node.right, context)}]`;
    }
}
