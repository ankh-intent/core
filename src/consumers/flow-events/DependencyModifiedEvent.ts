import { TreeNode } from '../../kernel/ast';
import { BaseCoreEvent } from '../../kernel/event';
import { DependencyNode, Identifiable } from '../../kernel/dependencies';

export interface DependencyModifiedEventProps<N extends TreeNode, T extends Identifiable<N>> {
  dependency: DependencyNode<N, T>;
}

export class DependencyModifiedEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<DependencyModifiedEventProps<N, T>> {
}
