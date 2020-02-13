import { TreeNode } from '../../kernel/ast';
import { Identifiable } from '../../kernel/dependencies';

export interface FileEmitResolverInterface<N extends TreeNode, T extends Identifiable<N>> {
  resolve(from: T): string | null;
}
