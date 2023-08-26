import {
    IfStatementNode,
    BlockNode,
    StatementNode,
    AssignmentStatementNode,
    ExpressionNode,
    IdentifierNode,
} from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type IfStatementSerializerChildren = {
    block: BlockNode;
    statement: StatementNode;
    identifier: IdentifierNode;
    expression: ExpressionNode;
};

export class IfStatementSerializer extends NodeSerializer<IfStatementNode, IfStatementSerializerChildren> {
    serialize(node: IfStatementNode, context: SerializingContext): string {
        const sub = context.nest();
        const condition = this.child.statement(node.condition, sub);
        const ifTrue = this.child.block(node.ifTrue, sub);
        const ifFalse = node.ifFalse && this.child.block(node.ifFalse, sub);
        const body = ifTrue + (ifFalse ? ` else ${ifFalse}` : '');

        if (node.condition instanceof AssignmentStatementNode && node.condition.isDeclaration()) {
            return `{${this.wrap([
                condition + ';',
                '',
                `if (${this.child.identifier(node.condition.targetBase, sub)}) ${body}`,
            ])}}`;
        }

        return this.wrap([
            '',
            `if (${condition}) ${body}`,
            '',
        ]);
    }
}
