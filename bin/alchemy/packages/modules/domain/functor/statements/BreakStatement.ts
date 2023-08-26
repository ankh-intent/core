import { BreakType, BreakStatementNode } from '@alchemy/ast';
import { Statement } from './Statement';

const KEYWORDS = {
    [BreakType.Break]: 'break',
    [BreakType.Continue]: 'continue',
};

export class BreakStatement extends Statement<BreakStatementNode> {
    public type: BreakType;

    toString() {
        return `${KEYWORDS[this.type]}`;
    }
}
