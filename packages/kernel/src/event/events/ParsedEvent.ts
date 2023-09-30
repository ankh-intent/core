import { SourceInterface } from '@intent/source';
import { BaseTokenTypes, TokenMatcher } from '@intent/parser';
import { TreeNode } from '@intent/ast';
import { BaseCoreEvent } from '../CoreEvent';

export interface ParsedEventProps<N extends TreeNode, TT extends BaseTokenTypes> {
    source: SourceInterface;
    tokens: TokenMatcher<TT>;
    ast: N;
}

export class ParsedEvent<N extends TreeNode, TT extends BaseTokenTypes> extends BaseCoreEvent<ParsedEventProps<N, TT>> {
}
