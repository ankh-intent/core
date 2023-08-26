import { Statement } from '../../../../../modules';
import {
    StatementNode,
    IfStatementNode,
    LoopStatementNode,
    BreakStatementNode,
    ReturnStatementNode,
    AssignmentStatementNode,
    ExpressionStatementNode,
    DecoratedStatementNode,
} from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';
import { TranslationContext } from '../../../TranslationContext';

export type StatementTranslatorChildren = {
    if_statement: IfStatementNode;
    loop_statement: LoopStatementNode;
    break_statement: BreakStatementNode;
    return_statement: ReturnStatementNode;
    assignment_statement: AssignmentStatementNode;
    expression_statement: ExpressionStatementNode;
    decorated_statement: DecoratedStatementNode;
};

export class StatementTranslator extends NodeTranslator<Statement, StatementTranslatorChildren> {
    translate(node: StatementNode, context: TranslationContext<any>): Statement {
        if (node instanceof DecoratedStatementNode) {
            return this.child.decorated_statement(node, context);
        } else if (node instanceof IfStatementNode) {
            return this.child.if_statement(node, context);
        } else if (node instanceof LoopStatementNode) {
            return this.child.loop_statement(node, context);
        } else if (node instanceof BreakStatementNode) {
            return this.child.break_statement(node, context);
        } else if (node instanceof ReturnStatementNode) {
            return this.child.return_statement(node, context);
        } else if (node instanceof AssignmentStatementNode) {
            return this.child.assignment_statement(node, context);
        } else if (node instanceof ExpressionStatementNode) {
            return this.child.expression_statement(node, context);
        }

        return Statement.create(node, context.parent, {
            toString(): string {
                return node.node;
            },
        });
    }
}
