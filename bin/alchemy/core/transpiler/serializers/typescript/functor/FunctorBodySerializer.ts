import { FunctorBodyNode, BlockNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export interface FunctorBodySerializerChildren {
  block: BlockNode;
}

export class FunctorBodySerializer extends NodeSerializer<FunctorBodyNode, FunctorBodySerializerChildren> {
  serialize(node: FunctorBodyNode, context): string {
    const sub = context.nest();

    if (node.isExpressionStatement) {
      return `{${this.wrap([
        (node.isReturnStatement ? '' : 'return ') + this.child.block(node.block, sub),
      ])}}`;
    }

    return this.child.block(node.block, sub);
  }
}
