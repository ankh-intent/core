import { TreeNode } from '@intent/ast';
import { SourceInterface } from '@intent/source';
import { Identifiable, DependencyNode } from '../../dependencies';
import { BaseCoreEvent } from '../CoreEvent';

export interface EmittedEventProps<N extends TreeNode, T extends Identifiable<N>> {
    dependency: DependencyNode<N, T>;
    source: SourceInterface;
}

export class EmittedEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<EmittedEventProps<N, T>> {
}
