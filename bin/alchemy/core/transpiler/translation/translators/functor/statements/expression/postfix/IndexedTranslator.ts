import { Indexed } from '../../../../../../../modules';
import { IndexedNode, ExpressionNode } from '../../../../../../ast';
import { NodeTranslator } from '../../../../../NodeTranslator';
import { TranslationContext } from '../../../../../TranslationContext';

export type IndexedTranslatorChildren = {
    expression: ExpressionNode;
};

export class IndexedTranslator extends NodeTranslator<Indexed, IndexedTranslatorChildren> {
    translate(node: IndexedNode, context: TranslationContext<any>): Indexed {
        return Indexed.create(node, context.parent, {
            right: this.child.expression(node.right, context),
        });
    }
}
