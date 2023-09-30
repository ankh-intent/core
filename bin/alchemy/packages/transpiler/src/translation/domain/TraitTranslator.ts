import { TranslationContext } from '@intent/translator';
import { Trait } from '@alchemy/modules';
import { TraitNode, DomainNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type TraitTranslatorChildren = {
    domain: DomainNode;
};

export class TraitTranslator extends AlchemyNodeTranslator<Trait, TraitTranslatorChildren> {
    translate(node: TraitNode<DomainNode>, context: TranslationContext<any>): Trait {
        return Trait.create(node, context.parentNode, {
            domain: this.child.domain(node.domain, context),
        });
    }
}
