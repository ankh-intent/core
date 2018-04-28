
import { CoreEvent } from '../../kernel/CoreEvent';
import { ParsedEvent } from '../parsing/ParsedEvent';
import { AbstractConsumer } from '../../kernel/AbstractConsumer';
import { ConsumerStat } from '../../kernel/ConsumerStat';

import { ChipNode } from '../interpreting/intent/ast/ChipNode';
import { ASTBuilder } from './ASTBuilder';
import { CoreEventBus } from '../../kernel/CoreEventBus';
import { Source } from '../reading/source/Source';
import { AnalyzedEvent } from './AnalyzedEvent';

export class AstStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}

export class ParseConsumer extends AbstractConsumer<ParsedEvent, any>{
  private parser: ASTBuilder<ChipNode>;

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
