import { BlockNode } from './BlockNode';
import { LoopIteratorNode } from './LoopIteratorNode';
import { StatementNode } from './StatementNode';

export class LoopStatementNode extends StatementNode {
    constructor(
        public iterator: LoopIteratorNode,
        public block: BlockNode,
    ) {
        super();
    }

    get children() {
        return [this.iterator, this.block];
    }

    get isAssertion() {
        return false;
    }
}
