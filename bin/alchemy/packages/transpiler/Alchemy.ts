import { SourceInterface, RangeInterface, BaseTokenTypes, TokenMatcher } from '@intent/kernel';
import { pure } from './tokenizer';

export class AlchemyTokenMatcher extends TokenMatcher {
    protected readonly types = Object.values(BaseTokenTypes) as BaseTokenTypes[];

    constructor(source: SourceInterface, range: RangeInterface) {
        super(pure, source, range);
    }
}
