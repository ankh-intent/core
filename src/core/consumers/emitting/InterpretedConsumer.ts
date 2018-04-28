
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';
import { ConsumerStat } from '../../kernel/event/consumer/ConsumerStat';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { InterpretedEvent } from '../interpreting/InterpretedEvent';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { FileWriter } from '../reading/source/FileWriter';
import { ErrorEvent } from '../../kernel/event/events/ErrorEvent';
import { Source } from '../reading/source/Source';
import { StringSource } from '../reading/source/StringSource';
import { FileEmitResolver } from '../../../intent-core/chips/FileEmitResolver';
import { Chip } from '../../../intent-core/chips/Chip';

export class EmitStat extends ConsumerStat {
  public constructor(public readonly chip: Chip, public readonly start: number) {
    super();
  }
}

export class EmittedStat extends EmitStat {
  public constructor(
    public readonly chip: Chip,
    public readonly source: Source,
    public readonly start: number,
    public readonly end: number,
    public readonly index: number,
  ) {
    super(chip, start);
  }
}

export class InterpretedConsumer extends AbstractConsumer<InterpretedEvent, any>{
  private readonly writer: FileWriter;
  private readonly resolver: FileEmitResolver;
  private total: number = 0;

  public constructor(bus: CoreEventBus, resolver: FileEmitResolver, writer: FileWriter) {
    super(bus);
    this.resolver = resolver;
    this.writer = writer;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === InterpretedEvent.type();
  }

  public process(event: InterpretedEvent) {
    let { dependency, content } = event.data;
    let start = +new Date();
    this.stat(event, new EmitStat(dependency.chip, start));

    let resolved = this.resolver.resolve(dependency.chip);
    let source = new StringSource(content, resolved);

    this.writer
      .write(source)
      .then(() => {
        this.emit(event, false);

        this.stat(event, new EmittedStat(
          dependency.chip,
          source,
          start,
          +new Date(),
          ++this.total,
        ));
      })
      .catch((error) => {
        this.emit(new ErrorEvent({ error }, event))
      })
    ;
  }
}
