import { AbstractNode } from '@intent/kernel';

export enum PrimitiveType {
    String,
    Number,
}

export class PrimitiveNode extends AbstractNode {
    constructor(
        public value: string,
        public type: PrimitiveType,
    ) {
        super();
    }
}
