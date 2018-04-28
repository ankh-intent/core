
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { ParsedEvent } from '../parsing/ParsedEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';
import { ConsumerStat } from '../../kernel/event/consumer/ConsumerStat';

import { ChipNode } from '../interpreting/intent/ast/ChipNode';
import { ASTBuilder } from './ASTBuilder';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { Source } from '../reading/source/Source';
import { AnalyzedEvent } from './AnalyzedEvent';

export class AstStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}

export class ParseConsumer extends AbstractConsumer<ParsedEvent, any>{
  private readonly parser: ASTBuilder<ChipNode>;

  public constructor(bus: CoreEventBus, parser: ASTBuilder<ChipNode>) {
    super(bus);
    this.parser = parser;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === ParsedEvent.type();
  }

  public process(event: ParsedEvent) {
    let { source, tokens } = event.data;
    this.stat(event, new AstStat(source));

    return new AnalyzedEvent({
      source,
      ast: this.parser.build(tokens),
    });
  }
}
