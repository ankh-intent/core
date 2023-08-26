import { LoopStatementNode } from '../../../../transpiler';
import { Block } from './Block';
import { LoopIterator } from './LoopIterator';
import { Statement } from './Statement';

export class LoopStatement extends Statement<LoopStatementNode> {
    public iterator: LoopIterator;
    public block: Block;

    get isAssertion() {
        return false;
    }

    toString() {
        return `each (${this.iterator}) ${this.block}`;
    }
}
