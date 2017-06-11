
import { TreeNode } from '../tree/TreeNode';

export class AbstractNode implements TreeNode {

  public get type() {
    return (<any>this.constructor).name.replace(/Node$/, '').toLowerCase();
  }

}
