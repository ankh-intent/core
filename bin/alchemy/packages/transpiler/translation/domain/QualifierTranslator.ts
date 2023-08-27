import { TranslationContext } from '@intent/translator';
import { Qualifier } from '@alchemy/modules';
import { QualifierNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type QualifierTranslatorChildren = {
    qualifier: QualifierNode;
};

export class QualifierTranslator extends AlchemyNodeTranslator<Qualifier, QualifierTranslatorChildren> {
    translate(node: QualifierNode, context: TranslationContext<any>): Qualifier {
        const { node: qualifier, context: inner } = context.spawn(Qualifier, node);

        qualifier.name = node.name;
        qualifier.child = node.child && this.child.qualifier(node.child, inner);

        return qualifier;
    }
}
