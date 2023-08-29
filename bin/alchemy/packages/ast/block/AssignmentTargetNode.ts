import { AbstractNode } from '@intent/kernel';

import { ExpressionNode } from '../expression';
import { ReferenceNode } from '../reference';
import { DereferenceNode } from '../spread';

export class AssignmentTargetNode<N extends AbstractNode = AbstractNode> extends AbstractNode {
    constructor(
        public target: ExpressionNode<N>,
        public type: ReferenceNode | null = null,
    ) {
        super();
    }

    get children() {
        return [this.target, this.type!].filter(Boolean);
    }

    get declaredAs(): string {
        return this.isDeclaration() && this.target.base.identifier || '';
    }

    isDeclaration(): this is AssignmentTargetNode<DereferenceNode> {
        return this.target.base instanceof DereferenceNode;
    }
}
