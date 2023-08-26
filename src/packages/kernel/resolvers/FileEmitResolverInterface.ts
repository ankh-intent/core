import { TreeNode } from '@intent/ast';
import { Identifiable } from '../dependencies';

export interface FileEmitResolverInterface<N extends TreeNode, T extends Identifiable<N>> {
    resolve(from: T): string | null;
}
