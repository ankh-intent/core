import { AbstractNode } from '@intent/kernel';
import { FunctorArgsNode } from './FunctorArgsNode';

import { ReferenceNode, GenericTemplatesNode } from '../reference';
import { FunctorBodyNode } from './FunctorBodyNode';

export class FunctorNode extends AbstractNode {
    public constructor(
        public args: FunctorArgsNode,
        public returns: ReferenceNode | null,
        public generic: GenericTemplatesNode,
        public body: FunctorBodyNode,
    ) {
        super();
    }

    get isExpressionStatement() {
        return this.body.isExpressionStatement;
    }

    get children() {
        return [this.generic!, this.args, this.returns!, this.body].filter(Boolean);
    }
}
