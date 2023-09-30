import { TreeNode } from '@intent/ast';
import { Identifiable, DependencyNode } from '../../dependencies';
import { ConsumerStat } from './ConsumerStat';

export class SynchronizeStat<N extends TreeNode, T extends Identifiable<N>> extends ConsumerStat {
    public constructor(public readonly dependency: DependencyNode<N, T>) {
        super();
    }
}
