
import { Tokens } from '../parsing/parser/Tokens';
import { TreeNode } from './tree/TreeNode';

export interface TokensVisitor<N extends TreeNode> {

  visit(tokens: Tokens): N;

}
