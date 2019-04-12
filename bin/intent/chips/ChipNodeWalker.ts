import { TreeNodeVisitors, TreeNodeWalker } from '@intent/kernel/ast/TreeNodeVisitor';

import { Chip } from './Chip';

export class ChipNodeWalker extends TreeNodeWalker<Chip> {
  public walk(node: Chip, visitors: TreeNodeVisitors<Chip>, context?: any): boolean {
    for (const name in node.linked) {
      this.walk(node.linked[name], visitors, {
        name,
        context,
      });
    }

    return super.walk(node, visitors, context);
  }
}
