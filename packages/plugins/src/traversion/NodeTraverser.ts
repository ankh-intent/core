import { TreeNode } from '@intent/kernel';

import { Walker, NodeIdentifiersMap } from '../tree';

export abstract class NodeTraverser<N extends TreeNode, C, I extends NodeIdentifiersMap> extends Walker<N, C, string, I> {
    visit(node: N, context: C): string {
        return this.traverse(node, context);
    }

    abstract traverse(node: N, context: C): string;
}
