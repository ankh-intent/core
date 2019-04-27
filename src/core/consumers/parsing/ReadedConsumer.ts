
import { Source } from '../../kernel/source/Source';
import { Tokens } from '../../kernel/parser/Tokens';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';
import { ConsumerStat } from '../../kernel/event/consumer/ConsumerStat';
import { ReadedEvent } from '../reading/ReadedEvent';
import { ParsedEvent } from './ParsedEvent';

export interface TokensFactory {
  (source: Source): Tokens;
}

export class ParseStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}

export class ReadedConsumer extends AbstractConsumer<ReadedEvent, any>{
  private readonly factory: TokensFactory;

  constructor(bus: CoreEventBus, factory: TokensFactory) {
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
