import { AbstractNode } from '@intent/kernel';
import { FunctorArgsNode } from './FunctorArgsNode';

import { ReferenceNode } from '../reference';
import { FunctorBodyNode } from './FunctorBodyNode';

export class FunctorNode extends AbstractNode {
    public constructor(
        public args: FunctorArgsNode,
        public returns: ReferenceNode | null,
        public body: FunctorBodyNode,
    ) {
        super();
    }

    get children() {
        return [this.args, this.returns!, this.body].filter(Boolean);
    }
}
