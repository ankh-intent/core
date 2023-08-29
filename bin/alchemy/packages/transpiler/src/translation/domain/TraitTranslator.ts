import { TranslationContext } from '@intent/translator';
import { Trait } from '@alchemy/modules';
import { TraitNode, ExpressionNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type TraitTranslatorChildren = {
    expression: ExpressionNode;
};

export class TraitTranslator extends AlchemyNodeTranslator<Trait, TraitTranslatorChildren> {
    translate(node: TraitNode, context: TranslationContext<any>): Trait {
        return Trait.create(node, context.parentNode, {
            identifier: node.identifier,
            expression: this.child.expression(node.expression, context),
        });
    }
}
