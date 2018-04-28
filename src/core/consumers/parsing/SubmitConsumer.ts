
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { ReadedEvent } from '../reading/ReadedEvent';
import { ParsedEvent } from './ParsedEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';
import { ConsumerStat } from '../../kernel/event/consumer/ConsumerStat';

import { Context, Intent } from './parser/Tokenizer';
import { Tokens } from './parser/Tokens';

import { ChipNode } from '../interpreting/intent/ast/ChipNode';
import { ASTBuilder } from '../ast-compiling/ASTBuilder';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { ErrorEvent } from '../../kernel/event/events/ErrorEvent';
import { Source } from '../reading/source/Source';

export class ParseStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}

export class SubmitConsumer extends AbstractConsumer<ReadedEvent, any>{
  private readonly parser: ASTBuilder<ChipNode>;

  public constructor(bus: CoreEventBus, parser: ASTBuilder<ChipNode>) {
    super(bus);
    this.parser = parser;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === ReadedEvent.type();
  }

  public process(event: ReadedEvent) {
    let { source } = event.data;
    this.stat(event, new ParseStat(source));

    return new ParsedEvent({
      source,
      tokens:
        new Tokens(
          (context: Context) => {
            let token;

            while (token = Intent.wrapped(context)) {
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
