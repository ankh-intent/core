import { AbstractNode } from '@intent/kernel';
import { ObjectSpreadNode } from './ObjectSpreadNode';

export class DereferenceNode extends AbstractNode {
    constructor(
        public identifier: string | null = null,
        public spread: ObjectSpreadNode | null = null,
    ) {
        super();
    }

    get children() {
        return [this.spread!].filter(Boolean);
    }

    isSpread(): this is DereferenceNode & { spread: ObjectSpreadNode } {
        return !!this.spread;
    }
}
