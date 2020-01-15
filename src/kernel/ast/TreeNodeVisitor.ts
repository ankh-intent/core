
import { TreeNode } from './TreeNode';

export interface TreeNodeVisitor<N extends TreeNode> {
  (node: N, context: any): boolean|void;
}

export interface TreeNodeVisitors<N extends TreeNode> {
  [type: string]: TreeNodeVisitor<N>;
}

export class TreeNodeWalker<N extends TreeNode> {
  public walk(node: N, visitors: TreeNodeVisitors<N>, context?: any): boolean {
    const visitor = visitors[node.node];

    if (visitor) {
      const result = visitor(node, context);

      if (result !== undefined) {
        return <boolean>result;
      }
    }

    return true;
  }
}
