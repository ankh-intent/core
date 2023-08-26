import { UsesNode } from '@alchemy/ast';
import { Translated } from '../../Translated';
import { Use } from './Use';

export class Uses extends Translated<UsesNode> {
    public map: Map<string, Use> = new Map();

    toString() {
        return `${[...this.map.values()].map((use) => `${use};`).join('\n')}\n`;
    }
}
