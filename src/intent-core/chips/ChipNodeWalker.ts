
import { TreeNodeVisitors, TreeNodeWalker } from '../tree/TreeNodeVisitor';
import { Chip } from './Chip';

export class ChipNodeWalker extends TreeNodeWalker<Chip> {

  public walk(node: Chip, visitors: TreeNodeVisitors<Chip>, context?: any): boolean {
    for (let name in node.linked) {
      this.walk(node.linked[name], visitors, {
        name,
        context,
      });
    }

    return super.walk(node, visitors, context);
  }

}
