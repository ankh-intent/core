import { Source } from '@intent/source';
import { BaseCoreEvent, DependencyNode, Identifiable, TreeNode } from '../../kernel';

export interface EmittedEventProps<N extends TreeNode, T extends Identifiable<N>> {
  dependency: DependencyNode<N, T>;
  source: Source;
}

export class EmittedEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<EmittedEventProps<N, T>> {
}
