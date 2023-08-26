import { LoopIterator } from '@alchemy/modules';
import { LoopIteratorNode, ExpressionNode, AssignmentTargetNode } from '@alchemy/ast';
import { NodeTranslator } from '../../../NodeTranslator';
import { TranslationContext } from '../../../TranslationContext';

export type LoopIteratorTranslatorChildren = {
    expression: ExpressionNode;
    assignment_target: AssignmentTargetNode;
};

export class LoopIteratorTranslator extends NodeTranslator<LoopIterator, LoopIteratorTranslatorChildren> {
    translate(node: LoopIteratorNode, context: TranslationContext<any>): LoopIterator {
        return LoopIterator.create(node, context.parent, {
            target: this.child.assignment_target(node.target, context),
            expression: this.child.expression(node.expression, context),
        });
    }
}
