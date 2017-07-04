
import { Tokens } from './parser/Tokens';
import { TreeNode } from './tree/TreeNode';

export interface ASTBuilder<N extends TreeNode> {

  build(tokens: Tokens): N;

}
