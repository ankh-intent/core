import { Decomposition } from '../../../../modules';
import { QualifierNode, DecompositionNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type DecompositionTranslatorChildren = {
    qualifier: QualifierNode;
    decomposition: DecompositionNode;
};

export class DecompositionTranslator extends NodeTranslator<Decomposition, DecompositionTranslatorChildren> {
    translate(node: DecompositionNode, c): Decomposition {
        return Decomposition.create(node, c.parent, {
            alias: node.alias,
            qualifier: this.child.qualifier(node.qualifier, c),
            items: (
                Object
                    .entries(node.items)
                    .map(([key, item]) => [key, this.child.decomposition(item, c)])
                    .reduce((acc, [key, item]) => (acc[key] = item, acc), {})
            ),
        });
    }
}
