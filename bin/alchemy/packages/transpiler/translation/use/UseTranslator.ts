import { TranslationContext } from '@intent/translator';
import { Use } from '@alchemy/modules';
import { UseNode, DecompositionNode } from '@alchemy/ast';
import { AlchemyNodeTranslator } from '../AlchemyNodeTranslator';

export type UseTranslatorChildren = {
    decomposition: DecompositionNode;
};

export class UseTranslator extends AlchemyNodeTranslator<Use, UseTranslatorChildren> {
    translate(node: UseNode, context: TranslationContext<any>): Use {
        return Use.create(node, context.parent, {
            decomposition: this.child.decomposition(node.decomposition, context),
        });
    }
}
