import { AbstractNode } from '@intent/kernel';

import { DomainNode } from './domain';
import { UsesNode } from './use';

export class ModuleNode extends AbstractNode {
    constructor(
        public identifier: string,
        public uses: UsesNode,
        public domain: DomainNode,
    ) {
        super();
    }

    public get children() {
        return [this.uses, this.domain];
    }
}
