
import { Tokens } from '../../kernel/parser/Tokens';
import { TreeNode } from '../../kernel/ast/TreeNode';

export interface ASTBuilder<N extends TreeNode> {

  build(tokens: Tokens): N;

}
