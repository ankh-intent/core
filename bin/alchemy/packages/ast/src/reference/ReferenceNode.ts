import { AbstractNode } from '@intent/kernel';

import { QualifierNode } from './QualifierNode';
import { TypeGenericNode } from './TypeGenericNode';

export class ReferenceNode extends AbstractNode {
    public constructor(
        public qualifier: QualifierNode,
        public generic: TypeGenericNode<ReferenceNode> | null = null,
        public isArray: boolean = false,
    ) {
        super();
    }

    toString() {
        return `${this.qualifier.path()}${this.generic ? String(this.generic) : ''}${this.isArray ? '[]' : ''}`;
    }

    public get children() {
        return [this.qualifier, this.generic!].filter(Boolean);
    }
}
