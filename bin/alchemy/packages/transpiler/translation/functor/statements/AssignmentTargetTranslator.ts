import { TranslationContext } from '@intent/translator';
import { AssignmentTarget } from '@alchemy/modules';
import { ExpressionNode, AssignmentTargetNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../AlchemyNodeTranslator';

export type AssignmentTargetTranslatorChildren = {
    expression: ExpressionNode;
};

export class AssignmentTargetTranslator extends AlchemyNodeTranslator<AssignmentTarget, AssignmentTargetTranslatorChildren> {
    translate(node: AssignmentTargetNode, context: TranslationContext<any>): AssignmentTarget {
        return AssignmentTarget.create(node, context.parent, {
            _isDeclaration: node.isDeclaration(),
            target: this.child.expression(node.target, context),
        });
    }
}
