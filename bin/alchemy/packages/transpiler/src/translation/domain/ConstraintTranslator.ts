import { TranslationContext } from '@intent/translator';
import { Constraint } from '@alchemy/modules';
import { ExpressionNode, ConstraintNode, DomainNode, ReferenceNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type ConstraintTranslatorChildren = {
    reference: ReferenceNode;
    expression: ExpressionNode;
};

export class ConstraintTranslator extends AlchemyNodeTranslator<Constraint, ConstraintTranslatorChildren> {
    translate(node: ConstraintNode, context: TranslationContext<any>): Constraint {
        return Constraint.create(node, context.parentNode, {
            reference: this.child.reference(node.type, context),
            expression: node.expression && this.child.expression(node.expression, context),
        });
    }
}
