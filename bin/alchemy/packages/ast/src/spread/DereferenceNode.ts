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

    isIdentifier(): this is this & { identifier: string } {
        return !this.spread;
    }

    isSpread(): this is this & { spread: ObjectSpreadNode } {
        return !!this.spread;
    }
}
