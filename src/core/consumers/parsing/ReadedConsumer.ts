
import { Source } from '../../kernel/source/Source';
import { BaseTokenTypes } from '../../kernel/parser/Tokenizer';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { ConsumerStat } from '../../kernel/event/consumer/ConsumerStat';
import { ReadedEvent } from '../reading/ReadedEvent';
import { ParsedEvent, ParsedEventProps } from './ParsedEvent';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';

export interface TokensFactory<TT extends typeof BaseTokenTypes> {
  (source: Source): ParsedEventProps<TT>;
}

export class ParseStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}

export class ReadedConsumer<TT extends typeof BaseTokenTypes> extends AbstractConsumer<ReadedEvent, any>{
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

    return new ParsedEvent(
      this.factory(source),
    );
  }
}
