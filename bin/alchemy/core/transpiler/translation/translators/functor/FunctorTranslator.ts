import { Functor, FunctorArgs, FunctorBody } from '../../../../modules';
import { FunctorNode, FunctorArgsNode, FunctorBodyNode, ReferenceNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type FunctorTranslatorChildren = {
  reference: ReferenceNode;
  // functor_args: FunctorArgsNode;
  // functor_body: FunctorBodyNode;
};

export class FunctorTranslator extends NodeTranslator<Functor, FunctorTranslatorChildren> {
  translate(node: FunctorNode, c): Functor {
    const { node: functor, context } = c.spawn(Functor, node);

    functor.args = new FunctorArgs(node.args);
    functor.returns = node.returns && this.child.reference(node.returns, context);
    functor.body = new FunctorBody(node.body);

    return functor;
  }
}
