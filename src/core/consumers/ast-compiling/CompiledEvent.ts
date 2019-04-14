
import { TreeNode } from '../../kernel/ast/TreeNode';
import { BaseCoreEvent } from '../../kernel/event/CoreEvent';
import { DependencyNode, Identifiable } from '../../kernel/watchdog/dependencies/DependencyNode';

export interface CompiledEventProps<N extends TreeNode, T extends Identifiable<N>> {
  dependency: DependencyNode<N, T>;
}

export class CompiledEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<CompiledEventProps<N, T>> {
}
