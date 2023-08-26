import { Decomposition } from '../../../../modules';
import { QualifierNode, DecompositionNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';
import { TranslationContext } from '../../TranslationContext';

export type DecompositionTranslatorChildren = {
    qualifier: QualifierNode;
    decomposition: DecompositionNode;
};

export class DecompositionTranslator extends NodeTranslator<Decomposition, DecompositionTranslatorChildren> {
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
