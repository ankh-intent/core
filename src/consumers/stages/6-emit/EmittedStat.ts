import { Source } from '@intent/source';

import { TreeNode, Identifiable } from '../../../kernel';
import { EmitStat } from './EmitStat';

export class EmittedStat<N extends TreeNode, T extends Identifiable<N>> extends EmitStat<N, T> {
    public constructor(
        public readonly identifiable: T,
        public readonly source: Source,
        public readonly start: number,
        public readonly end: number,
        public readonly index: number,
    ) {
        super(identifiable, start);
    }
}
