import { TreeNode } from '@intent/ast';
import { Identifiable, DependencyNode } from '../../dependencies';
import { BaseCoreEvent } from '../CoreEvent';

export interface TranspiledEventProps<N extends TreeNode, T extends Identifiable<N>> {
    content: string;
    dependency: DependencyNode<N, T>;
}

export class TranspiledEvent<N extends TreeNode, T extends Identifiable<N>> extends BaseCoreEvent<TranspiledEventProps<N, T>> {
}
