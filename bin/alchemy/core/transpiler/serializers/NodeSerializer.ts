import { TreeNode } from '@intent/kernel/ast';
import { Walker, NodeInvokers } from '@intent/kernel/tree/Walker';

export abstract class NodeSerializer<N extends TreeNode, I> extends Walker<N, string, NodeInvokers<I>> {
  visit(node: N): string {
    return this.serialize(node);
  }

  abstract serialize(node: N): string;
}
