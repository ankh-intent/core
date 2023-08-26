import { CallArgNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type CallArgSerializerChildren = {
    expression: ExpressionNode;
};

export class CallArgSerializer extends NodeSerializer<CallArgNode, CallArgSerializerChildren> {
    serialize(node: CallArgNode, context: SerializingContext): string {
        return (node.identifier ? `/* ${node.identifier}: */` : '') + this.child.expression(node.expression, context);
    }
}
