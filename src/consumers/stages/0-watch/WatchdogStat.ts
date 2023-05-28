import { TreeNode, Identifiable, DependencyNode, ConsumerStat } from '../../../kernel';

export enum WatchdogStatType {
    WATCH,
    UNWATCH,
}

export class WatchdogStat<N extends TreeNode, T extends Identifiable<N>> extends ConsumerStat {
    public constructor(public readonly watch: WatchdogStatType, public readonly node: DependencyNode<N, T>) {
        super();
    }
}
