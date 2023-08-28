import { AbstractNode } from '@intent/kernel';

import { ExpressionNode, IdentifierNode } from '../expression';
import { ReferenceNode } from '../reference';

export class AssignmentTargetNode<N extends AbstractNode = AbstractNode> extends AbstractNode {
    private readonly _isDeclaration: string;

    constructor(
        public target: ExpressionNode<N>,
        public type: ReferenceNode | null = null,
        isDeclarationOf: string = '',
    ) {
        super();
        this._isDeclaration = isDeclarationOf;
    }

    get children() {
        return [this.target, this.type!].filter(Boolean);
    }

    isDeclaration(): this is AssignmentTargetNode<IdentifierNode> {
        return !!this._isDeclaration;
    }
}
