import { ExpressionNode } from '../expression';
import { QualifierNode, ReferenceNode, GenericTemplatesNode } from '../reference';
import { UsesNode } from '../use';
import { DomainNode } from './DomainNode';
import { DomainInterfaceNode } from './interface';

export class EnumNode extends DomainNode {
    constructor(
        identifier: string,
        parent: ReferenceNode | undefined,
        public values: Map<QualifierNode, ExpressionNode> = new Map(),
    ) {
        super(identifier, new GenericTemplatesNode(), parent, false, new DomainInterfaceNode(), new UsesNode());
    }

    get children() {
        return [...super.children, ...this.values.keys(), ...this.values.values()];
    }
}
