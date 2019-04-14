
import { TreeNode } from '@intent/kernel/ast/TreeNode';
import { BaseCoreEvent } from '../../kernel/event/CoreEvent';
import { DependencyNode, Identifiable } from '../../kernel/watchdog/dependencies/DependencyNode';

export interface DependencyModifiedEventProps<N extends TreeNode, T extends Identifiable<N>> {
  dependency: DependencyNode<N, T>;
}

export class DependencyModifiedEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<DependencyModifiedEventProps<N, T>> {
}
