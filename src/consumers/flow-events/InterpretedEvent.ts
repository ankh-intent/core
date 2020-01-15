import { TreeNode } from '../../kernel/ast';
import { BaseCoreEvent } from '../../kernel/event';
import { DependencyNode, Identifiable } from '../../kernel/dependencies';

export interface InterpretedEventProps<N extends TreeNode, T extends Identifiable<N>> {
  content: string;
  dependency: DependencyNode<N, T>;
}

export class InterpretedEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<InterpretedEventProps<N, T>> {
}
