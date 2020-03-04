import { TreeNode, BaseCoreEvent, DependencyNode, Identifiable } from '../../kernel';

export interface CompiledEventProps<N extends TreeNode, T extends Identifiable<N>> {
  dependency: DependencyNode<N, T>;
}

export class PatchedASTEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<CompiledEventProps<N, T>> {
}
