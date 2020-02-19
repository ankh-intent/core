import { FunctorBodyNode, BlockNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface FunctorBodySerializerChildren {
  block: BlockNode;
}

export class FunctorBodySerializer extends NodeSerializer<FunctorBodyNode, FunctorBodySerializerChildren> {
  serialize(node: FunctorBodyNode): string {
    return this.child.block(node.block);
  }
}
