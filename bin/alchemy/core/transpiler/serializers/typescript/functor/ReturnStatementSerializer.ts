import { ReturnStatementNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface ReturnStatementSerializerChildren {
  expression: ExpressionNode;
}

export class ReturnStatementSerializer extends NodeSerializer<ReturnStatementNode, ReturnStatementSerializerChildren> {
  serialize(node: ReturnStatementNode): string {
    return `return${node.expression ? ' ' + this.child.expression(node.expression) : ''}`;
  }
}
