import { TranslationContext } from '@intent/translator';
import { Constraint } from '@alchemy/modules';
import { ExpressionNode, ConstraintNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type ConstraintTranslatorChildren = {
    expression: ExpressionNode;
};

export class ConstraintTranslator extends AlchemyNodeTranslator<Constraint, ConstraintTranslatorChildren> {
    translate(node: ConstraintNode, context: TranslationContext<any>): Constraint {
        return Constraint.create(node, context.parentNode, {
            expression: this.child.expression(node.expression, context),
        });
    }
}
