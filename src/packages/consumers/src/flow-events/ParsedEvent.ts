import { SourceInterface, BaseTokenTypes, TokenMatcher, TreeNode, BaseCoreEvent } from '@intent/kernel';

export interface ParsedEventProps<N extends TreeNode, TT extends BaseTokenTypes> {
    source: SourceInterface;
    tokens: TokenMatcher<TT>;
    ast: N;
}

export class ParsedEvent<N extends TreeNode, TT extends BaseTokenTypes> extends BaseCoreEvent<ParsedEventProps<N, TT>> {
}
