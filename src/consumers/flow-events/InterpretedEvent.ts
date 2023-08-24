import {TreeNode, BaseCoreEvent, DependencyNode, Identifiable} from '../../kernel';

export interface InterpretedEventProps<N extends TreeNode, T extends Identifiable<N>> {
    content: string;
    dependency: DependencyNode<N, T>;
}

export class InterpretedEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<InterpretedEventProps<N, T>> {
}
