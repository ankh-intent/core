import { Translated } from '@intent/translator';
import { ObjectSpreadNode } from '@alchemy/ast';
import { ObjectSpreadItem } from './ObjectSpreadItem';

export class ObjectSpread extends Translated<ObjectSpreadNode> {
    public items: ObjectSpreadItem<ObjectSpread>[] = [];

    toString() {
        return `{ ${this.items.join(', ')} }`;
    }
}
