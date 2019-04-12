
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { ReadedEvent } from '../reading/ReadedEvent';
import { ParsedEvent } from './ParsedEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';
import { ConsumerStat } from '../../kernel/event/consumer/ConsumerStat';

import { Context, Intent } from '../../kernel/parser/Tokenizer';
import { Tokens } from '../../kernel/parser/Tokens';

import { Source } from '../../kernel/source/Source';

export class ParseStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}

export class ReadedConsumer extends AbstractConsumer<ReadedEvent, any>{
  public supports(event: CoreEvent<any>): boolean {
    return event.type === ReadedEvent.type();
  }

  public process(event: ReadedEvent) {
    const { source } = event.data;
    this.stat(event, new ParseStat(source));

    return new ParsedEvent({
      source,
      tokens: new Tokens(
        (context: Context) => {
          let token;

          while ((token = Intent.wrapped(context))) {
            if (token.type !== 'whitespace') {
              break;
            }
          }

          return token;
        },
        source,
        source.range()
      ),
    });
  }
}
