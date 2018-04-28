
import { CoreEvent } from '../../kernel/CoreEvent';
import { SubmitEvent } from '../reading/SubmitEvent';
import { ParsedEvent } from './ParsedEvent';
import { AbstractConsumer } from '../../kernel/AbstractConsumer';
import { ConsumerStat } from '../../kernel/ConsumerStat';

import { Context, Intent } from './parser/Tokenizer';
import { Tokens } from './parser/Tokens';

import { ChipNode } from '../transpiling/intent/ast/ChipNode';
import { ASTBuilder } from '../ast-compiling/ASTBuilder';
import { CoreEventBus } from '../../kernel/CoreEventBus';
import { ErrorEvent } from '../../kernel/events/ErrorEvent';
import { Source } from '../reading/source/Source';

export class ParseStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}

export class SubmitConsumer extends AbstractConsumer<SubmitEvent, any>{
  private parser: ASTBuilder<ChipNode>;

  public constructor(bus: CoreEventBus, parser: ASTBuilder<ChipNode>) {
    super(bus);
    this.parser = parser;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === SubmitEvent.type();
  }

  public process(event: SubmitEvent) {
    let { source } = event.data;
    this.stat(event, new ParseStat(source));

    try {
      return new ParsedEvent({
        source: source,
        ast: this.parser.build(new Tokens(
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
        )),
      })
    } catch (e) {
      return new ErrorEvent({
        error: e,
      }, event);
    }
  }
}
