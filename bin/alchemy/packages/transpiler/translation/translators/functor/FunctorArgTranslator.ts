import { FunctorArg } from '@alchemy/modules';
import { FunctorArgNode, ReferenceNode } from '@alchemy/ast';
import { NodeTranslator } from '../../NodeTranslator';
import { TranslationContext } from '../../TranslationContext';

export type FunctorArgTranslatorChildren = {
    reference: ReferenceNode;
};

export class FunctorArgTranslator extends NodeTranslator<FunctorArg, FunctorArgTranslatorChildren> {
    translate(node: FunctorArgNode, context: TranslationContext<any>): FunctorArg {
        return FunctorArg.create(node, context.parent, {
            name: node.name,
            type: this.child.reference(node.type, context),
        });
    }
}
