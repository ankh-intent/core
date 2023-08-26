import { StatementNode } from './StatementNode';

export enum BreakType {
    Break,
    Continue,
}

export class BreakStatementNode extends StatementNode {
    constructor(
        public type: BreakType,
    ) {
        super();
    }
}
