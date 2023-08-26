import { AssignmentStatement } from '../../../../../modules';
import { ExpressionNode, AssignmentStatementNode, AssignmentTargetNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';
import { TranslationContext } from '../../../TranslationContext';

export type AssignmentStatementTranslatorChildren = {
    assignment_target: AssignmentTargetNode;
    expression: ExpressionNode;
};

export class AssignmentStatementTranslator extends NodeTranslator<AssignmentStatement, AssignmentStatementTranslatorChildren> {
    translate(node: AssignmentStatementNode, context: TranslationContext<any>): AssignmentStatement {
        return AssignmentStatement.create(node, context.parent, {
            target: this.child.assignment_target(node.target, context),
            operator: node.operator,
            expression: this.child.expression(node.expression, context),
        });
    }
}
