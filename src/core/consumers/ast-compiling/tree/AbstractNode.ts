
import { Region } from '../../reading/source/Region';
import { TreeNode } from './TreeNode';

export class AbstractNode implements TreeNode {
  public astRegion: Region;

  public get node() {
    return (<any>this.constructor).name.replace(/Node$/, '').toLowerCase();
  }
}
