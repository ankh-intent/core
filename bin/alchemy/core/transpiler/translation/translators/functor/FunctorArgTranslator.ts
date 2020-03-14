import { FunctorArg } from '../../../../modules/functor';
import { FunctorArgNode, ReferenceNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type FunctorArgTranslatorChildren = {
  reference: ReferenceNode;
};

export class FunctorArgTranslator extends NodeTranslator<FunctorArg, FunctorArgTranslatorChildren> {
  translate(node: FunctorArgNode, c): FunctorArg {
    return FunctorArg.create(node, c.parent, {
      name: node.name,
      type: this.child.reference(node.type, c),
    });
  }
}
