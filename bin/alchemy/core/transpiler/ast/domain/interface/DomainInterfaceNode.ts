import { AbstractNode } from '@intent/kernel';

import { DomainInterfacePropertyNode } from './DomainInterfacePropertyNode';

export class DomainInterfaceNode extends AbstractNode {
    constructor(
        public properties: Map<string, DomainInterfacePropertyNode> = new Map(),
    ) {
        super();
    }

    get children() {
        return [...this.properties.values()];
    }
}
