import { AbstractNode } from '@intent/kernel';

export class DomainModifierNode extends AbstractNode {
    constructor(
        public isNative: boolean = false,
        public isAbstract: boolean = false,
        public isAugment: boolean = false,
    ) {
        super();
    }

    get isSpecial() {
        return this.isNative || this.isAbstract || this.isAugment;
    }
}
