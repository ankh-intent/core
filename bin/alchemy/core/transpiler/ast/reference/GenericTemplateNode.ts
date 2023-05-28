import { AbstractNode } from '@intent/kernel';

import { IdentifierNode } from '../expression';
import { ReferenceNode } from './ReferenceNode';

export class GenericTemplateNode extends AbstractNode {
    public constructor(
        public identifier: IdentifierNode,
        public parent: ReferenceNode | null,
        public def: ReferenceNode | null,
    ) {
        super();
    }

    get children() {
        return [this.identifier, this.parent!, this.def!].filter(Boolean);
    }
}
