import { TranslationContext } from '@intent/translator';
import { AssignmentStatement } from '@alchemy/modules';
import { ExpressionNode, AssignmentStatementNode, AssignmentTargetNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../AlchemyNodeTranslator';

export type AssignmentStatementTranslatorChildren = {
    assignment_target: AssignmentTargetNode;
    expression: ExpressionNode;
};

export class AssignmentStatementTranslator extends AlchemyNodeTranslator<AssignmentStatement, AssignmentStatementTranslatorChildren> {
    translate(node: AssignmentStatementNode, context: TranslationContext<any>): AssignmentStatement {
        return AssignmentStatement.create(node, context.parentNode, {
            target: this.child.assignment_target(node.target, context),
            operator: node.operator,
            expression: this.child.expression(node.expression, context),
        });
    }
}
