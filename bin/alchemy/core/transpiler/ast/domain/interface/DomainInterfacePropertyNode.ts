import { AbstractNode } from '@intent/kernel';

import { ExpressionNode } from '../../expression';
import { ReferenceNode } from '../../reference';

export class DomainInterfacePropertyNode extends AbstractNode {
    constructor(
        public identifier: string,
        public expression: ExpressionNode | null,
        public type: ReferenceNode | null,
    ) {
        super();
    }

    get children() {
        return [this.expression!, this.type!].filter(Boolean);
    }
}
