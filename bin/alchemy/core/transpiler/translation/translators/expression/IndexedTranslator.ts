import { IndexedNode, ExpressionNode } from '../../../ast';
import { NodeTranslator } from '../../NodeTranslator';

export type IndexedTranslatorChildren = {
  expression: ExpressionNode;
};

export class IndexedTranslator extends NodeTranslator<IndexedNode, IndexedTranslatorChildren> {
  translate(node: IndexedNode, context): string {
    return `[${this.child.expression(node.right, context)}]`;
  }
}
