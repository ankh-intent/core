import { TranslationContext } from '@intent/translator';
import { ObjectSpreadItem, ObjectSpread } from '@alchemy/modules';
import { ObjectSpreadNode, ObjectSpreadItemNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type ObjectSpreadItemTranslatorChildren = {
    object_spread: ObjectSpreadNode;
};

export class ObjectSpreadItemTranslator extends AlchemyNodeTranslator<ObjectSpreadItem<ObjectSpread>, ObjectSpreadItemTranslatorChildren> {
    translate(node: ObjectSpreadItemNode<ObjectSpreadNode>, context: TranslationContext<any>): ObjectSpreadItem<ObjectSpread> {
        return <ObjectSpreadItem<ObjectSpread>>ObjectSpreadItem.create(node, context.parentNode, {
            identifier: node.identifier,
            spread: node.spread && this.child.object_spread(node.spread, context),
        });
    }
}
