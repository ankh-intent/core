
import { TreeNode } from '../tree/TreeNode';

export class AbstractNode implements TreeNode {

  public get node() {
    return (<any>this.constructor).name.replace(/Node$/, '').toLowerCase();
  }

}
