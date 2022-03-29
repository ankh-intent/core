import { TreeNode, Identifiable, DependencyNode, ConsumerStat } from '../../../kernel';

export class SynchronizeStat<N extends TreeNode, T extends Identifiable<N>> extends ConsumerStat {
  public constructor(public readonly dependency: DependencyNode<N, T>) {
    super();
  }
}
