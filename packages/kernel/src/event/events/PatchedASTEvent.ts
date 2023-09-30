import { TreeNode } from '@intent/ast';
import { Identifiable, DependencyNode } from '../../dependencies';
import { BaseCoreEvent } from '../CoreEvent';

export interface CompiledEventProps<N extends TreeNode, T extends Identifiable<N>> {
    dependency: DependencyNode<N, T>;
}

export class PatchedASTEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<CompiledEventProps<N, T>> {
}
