import * as util from 'util';

import { Region } from '@intent/source';

import { TreeNode } from './TreeNode';

export abstract class AbstractNode implements TreeNode {
  public astRegion: Region;

  public get children(): TreeNode[] {
    return [];
  }

  public get node() {
    return (<any>this.constructor).name.replace(/Node$/, '').toLowerCase();
  }

  [util.inspect.custom](depth, options) {
    const { astRegion, ...rest } = this;

    return options.stylize(this.constructor.name, 'special') + ' ' + util.inspect(rest, {
      ...options,
      depth: options.depth === null ? null : Math.max(options.depth - 1, 0),
    });
  }
}
