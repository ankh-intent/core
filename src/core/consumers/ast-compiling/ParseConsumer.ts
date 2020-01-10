import { TreeNode, TokenVisitor } from '../../kernel/ast';
import { CoreEvent, AbstractConsumer, ConsumerStat, CoreEventBus } from '../../kernel/event';
import { BaseTokenTypes } from '../../kernel/parser/Tokenizer';
import { ParsedEvent } from '../parsing/ParsedEvent';

import { Source } from '../../kernel/source';
import { AnalyzedEvent } from './AnalyzedEvent';
import { SyntaxError } from '../../kernel/parser/SyntaxError';

export class AstStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}

export class ParseConsumer<N extends TreeNode, TT extends BaseTokenTypes> extends AbstractConsumer<ParsedEvent<TT>, any>{
  private readonly parser: TokenVisitor<N, TT>;

  public constructor(bus: CoreEventBus, parser: TokenVisitor<N, TT>) {
    super(bus);
    this.parser = parser;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === ParsedEvent.type();
  }

  public process(event: ParsedEvent<TT>) {
    const { source, tokens } = event.data;
    this.stat(event, new AstStat(source));

    const ast = this.parser.visit(tokens);

    if (!ast) {
      throw new SyntaxError(`Can't parse source`, source, 0);
    }

    return new AnalyzedEvent({
      source,
      ast,
    });
  }
}
