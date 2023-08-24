import {TreeNode, Identifiable, ConsumerStat} from '../../../kernel';

export class EmitStat<N extends TreeNode, T extends Identifiable<N>> extends ConsumerStat {
    public constructor(public readonly identifiable: T, public readonly start: number) {
        super();
    }
}
