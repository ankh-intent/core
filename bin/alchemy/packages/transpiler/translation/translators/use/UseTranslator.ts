import { Use } from '@alchemy/modules';
import { UseNode, DecompositionNode } from '@alchemy/ast';
import { NodeTranslator } from '../../NodeTranslator';
import { TranslationContext } from '../../TranslationContext';

export type UseTranslatorChildren = {
    decomposition: DecompositionNode;
};

export class UseTranslator extends NodeTranslator<Use, UseTranslatorChildren> {
    translate(node: UseNode, context: TranslationContext<any>): Use {
        return Use.create(node, context.parent, {
            decomposition: this.child.decomposition(node.decomposition, context),
        });
    }
}
