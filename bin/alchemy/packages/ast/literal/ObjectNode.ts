import { AbstractNode } from '@intent/kernel';

import { ObjectPropertyNode } from './ObjectPropertyNode';

export class ObjectNode extends AbstractNode {
    constructor(
        public properties: Map<string, ObjectPropertyNode> = new Map(),
    ) {
        super();
    }

    public get children() {
        return [...this.properties.values()];
    }

    inspect(): any {
        return this.properties;
    }
}
