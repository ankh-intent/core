import { Functor } from '../../../../modules';
import { FunctorNode, FunctorArgsNode, FunctorBodyNode, ReferenceNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type FunctorTranslatorChildren = {
  reference: ReferenceNode;
  functor_args: FunctorArgsNode;
  functor_body: FunctorBodyNode;
};

export class FunctorTranslator extends NodeTranslator<Functor, FunctorTranslatorChildren> {
  translate(node: FunctorNode, c): Functor {
    return Functor.create(node, c.parent, {
      args: this.child.functor_args(node.args, c),
      returns: node.returns && this.child.reference(node.returns, c),
      body: this.child.functor_body(node.body, c),
    });
  }
}
