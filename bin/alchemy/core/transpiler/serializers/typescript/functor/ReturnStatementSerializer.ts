import { ReturnStatementNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type ReturnStatementSerializerChildren = {
    expression: ExpressionNode;
};

export class ReturnStatementSerializer extends NodeSerializer<ReturnStatementNode, ReturnStatementSerializerChildren> {
    serialize(node: ReturnStatementNode, context): string {
        return `return${node.expression ? ' ' + this.child.expression(node.expression, context) : ''}`;
    }
}
