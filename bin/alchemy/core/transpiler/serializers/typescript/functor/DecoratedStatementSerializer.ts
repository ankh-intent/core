import { StatementNode, DecoratedStatementNode, ExpressionNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';
import { SerializingContext } from '../../SerializingContext';

export type DecoratedStatementSerializerChildren = {
    statement: StatementNode;
    expression: ExpressionNode;
};

export class DecoratedStatementSerializer extends NodeSerializer<DecoratedStatementNode, DecoratedStatementSerializerChildren> {
    serialize(node: DecoratedStatementNode, context: SerializingContext): string {
        return this.wrapStatements([
            `@${this.child.expression(node.decorator, context)}`,
            this.child.statement(node.item, context),
        ]);
    }
}
