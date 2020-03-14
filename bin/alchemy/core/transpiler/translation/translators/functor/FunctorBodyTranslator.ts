import { FunctorBody } from '../../../../modules/functor';
import { FunctorBodyNode, BlockNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type FunctorBodyTranslatorChildren = {
  block: BlockNode;
};

export class FunctorBodyTranslator extends NodeTranslator<FunctorBody, FunctorBodyTranslatorChildren> {
  translate(node: FunctorBodyNode, c): FunctorBody {
    return FunctorBody.create(node, c.parent, {
      body: this.child.block(node.block, c),
    });
  }
}
