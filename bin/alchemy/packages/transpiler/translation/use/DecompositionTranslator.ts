import { TranslationContext } from '@intent/translator';
import { Decomposition } from '@alchemy/modules';
import { QualifierNode, DecompositionNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type DecompositionTranslatorChildren = {
    qualifier: QualifierNode;
    decomposition: DecompositionNode;
};

export class DecompositionTranslator extends AlchemyNodeTranslator<Decomposition, DecompositionTranslatorChildren> {
    translate(node: DecompositionNode, context: TranslationContext<any>): Decomposition {
        return Decomposition.create(node, context.parent, {
            alias: node.alias,
            qualifier: this.child.qualifier(node.qualifier, context),
            items: Object.fromEntries(
                Object
                    .entries(node.items)
                    .map(([key, item]) => [key, this.child.decomposition(item, context)])
            ),
        });
    }
}
