import { Source } from '@intent/source';
import { BaseTokenTypes, TokensFactory } from '@intent/parser';

import { CoreEventBus, AbstractConsumer, CoreEvent, ConsumerStat } from '../kernel/event';
import { ReadedEvent, ParsedEvent } from './flow-events';

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

  public supports(event: CoreEvent): boolean {
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
