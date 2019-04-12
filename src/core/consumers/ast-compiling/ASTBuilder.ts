
import { Tokens } from '../../kernel/parser/Tokens';
import { TreeNode } from '../../kernel/tree/TreeNode';

export interface ASTBuilder<N extends TreeNode> {

  build(tokens: Tokens): N;

}
