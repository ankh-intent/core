import { FunctorBodyNode, BlockNode } from '../../../ast';
import { NodeSerializer } from '../../NodeSerializer';

export type FunctorBodySerializerChildren = {
  block: BlockNode;
};

export class FunctorBodySerializer extends NodeSerializer<FunctorBodyNode, FunctorBodySerializerChildren> {
  serialize(node: FunctorBodyNode, context): string {
    const sub = context.nest();

    if (node.isExpressionStatement && node.isReturnStatement) {
      return `{${this.wrap([this.child.block(node.block, sub)])}}`;
    }

    return this.child.block(node.block, sub);
  }
}
