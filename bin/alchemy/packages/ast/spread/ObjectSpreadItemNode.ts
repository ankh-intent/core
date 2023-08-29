import { AbstractNode } from '@intent/kernel';

export class ObjectSpreadItemNode<N extends AbstractNode> extends AbstractNode {
    constructor(
        public identifier: string,
        public isRest: boolean,
        public spread?: N,
    ) {
        super();

        if (isRest && spread) {
            throw new Error(`Object spread item cannot be a rest ("...") item and a spread (":") item at the same time`);
        }
    }

    get children() {
        return [this.spread!].filter(Boolean);
    }

    isSpread<N extends AbstractNode>(): this is ObjectSpreadItemNode<N> {
        return !!this.spread;
    }
}
