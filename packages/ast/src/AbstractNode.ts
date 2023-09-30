import { InspectOptionsStylized, inspect } from 'node:util';

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

    inspect(_options: InspectOptionsStylized): any {
        return this;
    }

    [inspect.custom](_depth: number, options: InspectOptionsStylized): any {
        const depth = options.depth ?? 5;
        const data = this.inspect(options);
        const { astRegion, ...rest } = data;

        const inspected = typeof data === 'string' ? data : inspect(
            (astRegion || (data === this)) ? rest : data,
            { ...options, depth }
        );

        return options.stylize(this.constructor.name, 'special') + ' ' + inspected;
    }
}
