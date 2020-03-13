import { FunctorBodyNode, BlockNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type FunctorBodyTranslatorChildren = {
  block: BlockNode;
};

export class FunctorBodyTranslator extends NodeTranslator<FunctorBodyNode, FunctorBodyTranslatorChildren> {
  translate(node: FunctorBodyNode, context): string {
    const sub = context.nest();

    if (node.isExpressionStatement && node.isReturnStatement) {
      return `{${this.wrap([this.child.block(node.block, sub)])}}`;
    }

    return this.child.block(node.block, sub);
  }
}
