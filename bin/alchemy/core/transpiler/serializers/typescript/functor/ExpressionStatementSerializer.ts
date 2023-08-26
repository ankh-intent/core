import { ExpressionNode, ExpressionStatementNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type ExpressionStatementSerializerChildren = {
    expression: ExpressionNode;
};

export class ExpressionStatementSerializer extends NodeSerializer<ExpressionStatementNode, ExpressionStatementSerializerChildren> {
    serialize(node: ExpressionStatementNode, context: SerializingContext): string {
        return this.child.expression(node.expression, context);
    }
}
