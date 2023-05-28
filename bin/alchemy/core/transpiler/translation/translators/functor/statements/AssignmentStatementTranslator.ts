import { AssignmentStatement } from '../../../../../modules';
import { ExpressionNode, AssignmentStatementNode, AssignmentTargetNode } from '../../../../ast';
import { NodeTranslator } from '../../../NodeTranslator';

export type AssignmentStatementTranslatorChildren = {
    assignment_target: AssignmentTargetNode;
    expression: ExpressionNode;
};

export class AssignmentStatementTranslator extends NodeTranslator<AssignmentStatement, AssignmentStatementTranslatorChildren> {
    translate(node: AssignmentStatementNode, c): AssignmentStatement {
        return AssignmentStatement.create(node, c.parent, {
            target: this.child.assignment_target(node.target, c),
            operator: node.operator,
            expression: this.child.expression(node.expression, c),
        });
    }
}
