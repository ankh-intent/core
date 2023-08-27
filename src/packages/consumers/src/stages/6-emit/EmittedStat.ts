import { SourceInterface, TreeNode, Identifiable } from '@intent/kernel';

import { EmitStat } from './EmitStat';

export class EmittedStat<N extends TreeNode, T extends Identifiable<N>> extends EmitStat<N, T> {
    public constructor(
        public readonly identifiable: T,
        public readonly source: SourceInterface,
        public readonly start: number,
        public readonly end: number,
        public readonly index: number,
    ) {
        super(identifiable, start);
    }
}
