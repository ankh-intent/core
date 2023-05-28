import { AbstractNode } from '@intent/kernel';

import { CallArgNode } from './CallArgNode';

export class CallArgsNode extends AbstractNode {
    constructor(
        public args: CallArgNode[],
    ) {
        super();
    }

    get children() {
        return this.args;
    }
}
