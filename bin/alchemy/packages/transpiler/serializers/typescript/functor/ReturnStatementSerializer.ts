import { ReturnStatementNode, ExpressionNode } from '@alchemy/ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type ReturnStatementSerializerChildren = {
    expression: ExpressionNode;
};

export class ReturnStatementSerializer extends NodeSerializer<ReturnStatementNode, ReturnStatementSerializerChildren> {
    serialize(node: ReturnStatementNode, context: SerializingContext): string {
        return `return${node.expression ? ' ' + this.child.expression(node.expression, context) : ''}`;
    }
}
