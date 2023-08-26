import { AssignmentTarget } from '@alchemy/modules';
import { ExpressionNode, AssignmentTargetNode } from '@alchemy/ast';
import { NodeTranslator } from '../../../NodeTranslator';
import { TranslationContext } from '../../../TranslationContext';

export type AssignmentTargetTranslatorChildren = {
    expression: ExpressionNode;
};

export class AssignmentTargetTranslator extends NodeTranslator<AssignmentTarget<any>, AssignmentTargetTranslatorChildren> {
    translate(node: AssignmentTargetNode, context: TranslationContext<any>): AssignmentTarget<any> {
        return AssignmentTarget.create(node, context.parent, {
            _isDeclaration: node.isDeclaration(),
            target: this.child.expression(node.target, context),
        });
    }
}
