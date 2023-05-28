import { AbstractNode } from '@intent/kernel';

import { ReferenceNode } from '../reference';

export class FunctorArgNode extends AbstractNode {
    public constructor(
        public name: string,
        public type: ReferenceNode,
    ) {
        super();
    }

    get children() {
        return [this.type];
    }
}
