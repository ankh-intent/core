import { BaseTokenTypes, TokenMatcher } from '@intent/parser';

import { TreeNode } from './TreeNode';

export interface TokenVisitor<N extends TreeNode, TT extends BaseTokenTypes = BaseTokenTypes> {
  visit(tokens: TokenMatcher<TT>): N | null;
}
