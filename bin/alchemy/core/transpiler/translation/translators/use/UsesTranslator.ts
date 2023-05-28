import { Uses } from '../../../../modules';
import { UsesNode, UseNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type UsesTranslatorChildren = {
    use: UseNode;
};

export class UsesTranslator extends NodeTranslator<Uses, UsesTranslatorChildren> {
    translate(node: UsesNode, c): Uses {
        return Uses.create(node, c.parent, {
            map: new Map(
                node.entries.map(([alias, value]) => [alias, this.child.use(value, c)]),
            ),
        });
    }
}
