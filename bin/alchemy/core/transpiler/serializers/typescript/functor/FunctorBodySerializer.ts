import { FunctorBodyNode, BlockNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface FunctorBodySerializerChildren {
  block: BlockNode;
}

export class FunctorBodySerializer extends NodeSerializer<FunctorBodyNode, FunctorBodySerializerChildren> {
  serialize(node: FunctorBodyNode): string {
    if (node.isExpressionStatement) {
      return `{${this.wrap([
        (node.isReturnStatement ? '' : 'return ') + this.child.block(node.block),
      ])}}`;
    }

    return this.child.block(node.block);
  }
}
