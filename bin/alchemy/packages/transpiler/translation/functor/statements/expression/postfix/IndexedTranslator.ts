import { TranslationContext } from '@intent/translator';
import { Indexed } from '@alchemy/modules';
import { IndexedNode, ExpressionNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../../../../AlchemyNodeTranslator';

export type IndexedTranslatorChildren = {
    expression: ExpressionNode;
};

export class IndexedTranslator extends AlchemyNodeTranslator<Indexed, IndexedTranslatorChildren> {
    translate(node: IndexedNode, context: TranslationContext<any>): Indexed {
        return Indexed.create(node, context.parentNode, {
            right: this.child.expression(node.right, context),
        });
    }
}
