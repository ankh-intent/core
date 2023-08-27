import { Identifier } from '@alchemy/modules';
import { IdentifierNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../AlchemyNodeTranslator';
import { TranslationContext } from '@intent/translator';

export type IdentifierTranslatorChildren = {};

export class IdentifierTranslator extends AlchemyNodeTranslator<Identifier, IdentifierTranslatorChildren> {
    translate(node: IdentifierNode, context: TranslationContext<any>): Identifier {
        return Identifier.create(node, context.parent, {
            name: node.name,
        });
    }
}
