
import { Tokens } from '../parser/Tokens';
import { TreeNode } from './TreeNode';

export interface ASTBuilder<N extends TreeNode> {
  build(tokens: Tokens): N;
}
