import { BaseTokenTypes, TokensFactory, SyntaxError } from '@intent/parser';

import { TokenVisitor, TreeNode, CoreEventBus, AbstractConsumer, CoreEvent } from '../../../kernel';
import { ReadedEvent, ParsedEvent } from '../../flow-events';
import { ParseStat } from './ParseStat';

export class ParseAfterRead<N extends TreeNode, TT extends BaseTokenTypes> extends AbstractConsumer<ReadedEvent, any> {
    private readonly factory: TokensFactory<TT>;
    private readonly parser: TokenVisitor<N, TT>;

    constructor(bus: CoreEventBus, factory: TokensFactory<TT>, parser: TokenVisitor<N, TT>) {
        super(bus);
        this.factory = factory;
        this.parser = parser;
    }

    public supports(event: CoreEvent): boolean {
        return event.type === ReadedEvent.type();
    }

    public process(event: ReadedEvent) {
        const { source } = event.data;
        this.stat(event, new ParseStat(source));

        const tokens = this.factory(source);
        const ast = this.parser.visit(tokens);

        if (!ast) {
            throw new SyntaxError('parse(source)', `Can't parse source`, source, 0);
        }

        return new ParsedEvent({
            source,
            tokens,
            ast,
        });
    }
}
