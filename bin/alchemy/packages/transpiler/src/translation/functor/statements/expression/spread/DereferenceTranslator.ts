import { TranslationContext } from '@intent/translator';
import { Dereference } from '@alchemy/modules';
import { DereferenceNode, ObjectSpreadNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type DereferenceTranslatorChildren = {
    object_spread: ObjectSpreadNode;
};

export class DereferenceTranslator extends AlchemyNodeTranslator<Dereference, DereferenceTranslatorChildren> {
    translate(node: DereferenceNode, context: TranslationContext<any>): Dereference {
        return Dereference.create(node, context.parentNode, {
            identifier: node.identifier,
            spread: node.spread && this.child.object_spread(node.spread, context),
        });
    }
}
