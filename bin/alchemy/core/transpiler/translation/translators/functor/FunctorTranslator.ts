import { Functor } from '../../../../modules';
import { FunctorNode, FunctorArgsNode, FunctorBodyNode, ReferenceNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';
import { TranslationContext } from '../../TranslationContext';

export type FunctorTranslatorChildren = {
    reference: ReferenceNode;
    functor_args: FunctorArgsNode;
    functor_body: FunctorBodyNode;
};

export class FunctorTranslator extends NodeTranslator<Functor, FunctorTranslatorChildren> {
    translate(node: FunctorNode, context: TranslationContext<any>): Functor {
        return Functor.create(node, context.parent, {
            args: this.child.functor_args(node.args, context),
            returns: node.returns && this.child.reference(node.returns, context),
            body: this.child.functor_body(node.body, context),
        });
    }
}
