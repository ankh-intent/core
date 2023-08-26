import { TreeNode, BaseCoreEvent, DependencyNode, Identifiable } from '@intent/kernel';

export interface DependencyModifiedEventProps<N extends TreeNode, T extends Identifiable<N>> {
    dependency: DependencyNode<N, T>;
}

export class DependencyModifiedEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<DependencyModifiedEventProps<N, T>> {
}
