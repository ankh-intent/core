import { Uses } from '@alchemy/modules';
import { UsesNode, UseNode } from '@alchemy/ast';
import { NodeTranslator } from '../../NodeTranslator';
import { TranslationContext } from '../../TranslationContext';

export type UsesTranslatorChildren = {
    use: UseNode;
};

export class UsesTranslator extends NodeTranslator<Uses, UsesTranslatorChildren> {
    translate(node: UsesNode, context: TranslationContext<any>): Uses {
        return Uses.create(node, context.parent, {
            map: new Map(
                node.entries.map(([alias, value]) => [alias, this.child.use(value, context)]),
            ),
        });
    }
}
