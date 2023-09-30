import { TranslationContext } from '@intent/translator';
import { Identifier } from '@alchemy/modules';
import { IdentifierNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../AlchemyNodeTranslator';

export type IdentifierTranslatorChildren = {};

export class IdentifierTranslator extends AlchemyNodeTranslator<Identifier, IdentifierTranslatorChildren> {
    translate(node: IdentifierNode, context: TranslationContext<any>): Identifier {
        return Identifier.create(node, context.parentNode, {
            name: node.name,
        });
    }
}
