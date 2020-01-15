import { BaseTokenTypes, TokenMatcher } from '../parser';
import { TreeNode } from './TreeNode';

export interface TokenVisitor<N extends TreeNode, TT extends BaseTokenTypes = BaseTokenTypes> {
  visit(tokens: TokenMatcher<TT>): N|null;
}
