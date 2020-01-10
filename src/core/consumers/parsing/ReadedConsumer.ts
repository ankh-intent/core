
import { TokenMatcher, BaseTokenTypes } from '../../kernel/parser';
import { Source } from '../../kernel/source';
import { CoreEventBus, AbstractConsumer, CoreEvent, ConsumerStat } from '../../kernel/event';
import { ReadedEvent } from '../reading/ReadedEvent';
import { ParsedEvent } from './ParsedEvent';

export interface TokensFactory<TT extends BaseTokenTypes> {
  (source: Source): TokenMatcher<TT>;
}

export class ParseStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}

export class ReadedConsumer<TT extends BaseTokenTypes> extends AbstractConsumer<ReadedEvent, any>{
  private readonly factory: TokensFactory<TT>;

  constructor(bus: CoreEventBus, factory: TokensFactory<TT>) {
    super(bus);
    this.factory = factory;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === ReadedEvent.type();
  }

  public process(event: ReadedEvent) {
    const { source } = event.data;
    this.stat(event, new ParseStat(source));

    return new ParsedEvent({
      source,
      tokens: this.factory(source),
    });
  }
}
