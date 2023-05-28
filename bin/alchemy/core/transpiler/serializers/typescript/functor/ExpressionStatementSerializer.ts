import { ExpressionNode, ExpressionStatementNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type ExpressionStatementSerializerChildren = {
    expression: ExpressionNode;
};

export class ExpressionStatementSerializer extends NodeSerializer<ExpressionStatementNode, ExpressionStatementSerializerChildren> {
    serialize(node: ExpressionStatementNode, context): string {
        return this.child.expression(node.expression, context);
    }
}
