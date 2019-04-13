import { Tokens } from '../parser/Tokens';
import { TreeNode } from './TreeNode';

export interface TokenVisitor<N extends TreeNode> {
  visit(tokens: Tokens): N;
}
