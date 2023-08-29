import { AbstractNode } from '@intent/kernel';
import { ObjectSpreadItemNode } from './ObjectSpreadItemNode';

export class ObjectSpreadNode extends AbstractNode {
    constructor(
        public items: ObjectSpreadItemNode<ObjectSpreadNode>[] = [],
    ) {
        super();
    }

    get size() {
        return this.items.length;
    }

    get children() {
        return this.items;
    }
}
