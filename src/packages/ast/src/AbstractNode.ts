import { InspectOptionsStylized, inspect } from 'util';

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

    [inspect.custom](options: InspectOptionsStylized) {
        const { astRegion, ...rest } = this;
        const depth = options.depth ?? null;

        return options.stylize(this.constructor.name, 'special') + ' ' + inspect(rest, {
            ...options,
            depth: depth && Math.max(depth - 1, 0),
        });
    }
}
