
import { CoreEvent } from '../CoreEvent';
import { SubmitEvent } from '../events/SubmitEvent';
import { ParsedEvent } from '../events/ParsedEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { Context, Intent } from '../../parser/Tokenizer';
import { Tokens } from '../../parser/Tokens';

import { ChipNode } from '../../intent/ast/ChipNode';
import { ASTBuilder } from '../../ASTBuilder';
import { CoreEventBus } from '../CoreEventBus';
import { ErrorEvent } from '../events/ErrorEvent';

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
    this.stat(event, {
      type: 'parse',
      source,
    });

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
