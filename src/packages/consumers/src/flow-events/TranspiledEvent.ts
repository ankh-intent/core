import { TreeNode, BaseCoreEvent, DependencyNode, Identifiable } from '@intent/kernel';

export interface TranspiledEventProps<N extends TreeNode, T extends Identifiable<N>> {
    content: string;
    dependency: DependencyNode<N, T>;
}

export class TranspiledEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<TranspiledEventProps<N, T>> {
}
