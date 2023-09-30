import { TranslationContext } from '@intent/translator';
import { DomainModifierNode } from '@alchemy/ast';
import { DomainModifier } from '@alchemy/modules';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type DomainModifierTranslatorChildren = {};

export class DomainModifierTranslator extends AlchemyNodeTranslator<DomainModifier, DomainModifierTranslatorChildren> {
    translate(node: DomainModifierNode, context: TranslationContext<any>): DomainModifier {
        return DomainModifier.create(node, context.parentNode, {
            isNative: node.isNative,
            isAbstract: node.isAbstract,
            isAugment: node.isAugment,
        });
    }
}
