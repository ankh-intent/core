import { BaseTokenTypes } from '../parser/Tokenizer';
import { TokenMatcher } from '../parser/TokenMatcher';
import { TreeNode } from './TreeNode';

export interface TokenVisitor<N extends TreeNode, TT extends typeof BaseTokenTypes = any> {
  visit(tokens: TokenMatcher<TT>): N;
}
