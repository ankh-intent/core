import { TranslationContext } from '@intent/translator';
import { ObjectSpread } from '@alchemy/modules';
import { ObjectSpreadNode, ObjectSpreadItemNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type ObjectSpreadTranslatorChildren = {
    object_spread_item: ObjectSpreadItemNode<ObjectSpreadNode>;
};

export class ObjectSpreadTranslator extends AlchemyNodeTranslator<ObjectSpread, ObjectSpreadTranslatorChildren> {
    translate(node: ObjectSpreadNode, context: TranslationContext<any>): ObjectSpread {
        return ObjectSpread.create(node, context.parentNode, {
            items: node.items.map((item) => this.child.object_spread_item(item, context)),
        });
    }
}
