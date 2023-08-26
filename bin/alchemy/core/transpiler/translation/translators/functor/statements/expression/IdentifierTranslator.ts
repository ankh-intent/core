import { Identifier } from '../../../../../../modules';
import { IdentifierNode } from '../../../../../ast';
import { NodeTranslator } from '../../../../NodeTranslator';
import { TranslationContext } from '../../../../TranslationContext';

export type IdentifierTranslatorChildren = {};

export class IdentifierTranslator extends NodeTranslator<Identifier, IdentifierTranslatorChildren> {
    translate(node: IdentifierNode, context: TranslationContext<any>): Identifier {
        return Identifier.create(node, context.parent, {
            name: node.name,
        });
    }
}
