import { TreeNode } from '../../kernel/ast/TreeNode';
import { TokenVisitor } from '../../kernel/ast/TokenVisitor';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { ParsedEvent } from '../parsing/ParsedEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';
import { ConsumerStat } from '../../kernel/event/consumer/ConsumerStat';

import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { Source } from '../../kernel/source/Source';
import { AnalyzedEvent } from './AnalyzedEvent';

export class AstStat extends ConsumerStat {
  public constructor(public readonly source: Source) {
    super();
  }
}

export class ParseConsumer<N extends TreeNode> extends AbstractConsumer<ParsedEvent, any>{
  private readonly parser: TokenVisitor<N>;

  public constructor(bus: CoreEventBus, parser: TokenVisitor<N>) {
    super(bus);
    this.parser = parser;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === ParsedEvent.type();
  }

  public process(event: ParsedEvent) {
    const { source, tokens } = event.data;
    this.stat(event, new AstStat(source));

    return new AnalyzedEvent({
      source,
      ast: this.parser.visit(tokens),
    });
  }
}
