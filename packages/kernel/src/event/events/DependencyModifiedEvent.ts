import { TreeNode } from '@intent/ast';
import { Identifiable, DependencyNode } from '../../dependencies';
import { BaseCoreEvent } from '../CoreEvent';

export interface DependencyModifiedEventProps<N extends TreeNode, T extends Identifiable<N>> {
    dependency: DependencyNode<N, T>;
}

export class DependencyModifiedEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<DependencyModifiedEventProps<N, T>> {
}
