import { TranslationContext } from '@intent/translator';
import { LoopIterator } from '@alchemy/modules';
import { LoopIteratorNode, ExpressionNode, AssignmentTargetNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../AlchemyNodeTranslator';

export type LoopIteratorTranslatorChildren = {
    expression: ExpressionNode;
    assignment_target: AssignmentTargetNode;
};

export class LoopIteratorTranslator extends AlchemyNodeTranslator<LoopIterator, LoopIteratorTranslatorChildren> {
    translate(node: LoopIteratorNode, context: TranslationContext<any>): LoopIterator {
        return LoopIterator.create(node, context.parentNode, {
            target: this.child.assignment_target(node.target, context),
            expression: this.child.expression(node.expression, context),
        });
    }
}
