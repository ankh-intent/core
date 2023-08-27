import { TranslationContext } from '@intent/translator';
import { Uses } from '@alchemy/modules';
import { UsesNode, UseNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type UsesTranslatorChildren = {
    use: UseNode;
};

export class UsesTranslator extends AlchemyNodeTranslator<Uses, UsesTranslatorChildren> {
    translate(node: UsesNode, context: TranslationContext<any>): Uses {
        return Uses.create(node, context.parentNode, {
            map: new Map(
                node.entries.map(([alias, value]) => [alias, this.child.use(value, context)]),
            ),
        });
    }
}
