import { TreeNode } from '@intent/ast';

import { Walker, NodeIdentifiersMap } from '../tree';
import { Scope } from './Scope';

export abstract class NodeTraverser<N extends TreeNode, S extends Scope<any>, I extends NodeIdentifiersMap> extends Walker<N, S, string, I> {
    visit(node: N, context: S): string {
        return this.traverse(node, context);
    }

    abstract traverse(node: N, context: S): string;
}
