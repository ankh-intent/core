import { Region } from '@intent/source';

import { TreeNode } from './TreeNode';

export class AbstractNode implements TreeNode {
  public astRegion: Region;

  public get node() {
    return (<any>this.constructor).name.replace(/Node$/, '').toLowerCase();
  }
}
