
import { AbstractConsumer } from '../AbstractConsumer';
import { ConsumerStat } from './ConsumerStat';
import { CoreEvent } from '../CoreEvent';
import { InterpretedEvent } from '../events/InterpretedEvent';
import { CoreEventBus } from '../CoreEventBus';
import { FileWriter } from '../../source/FileWriter';
import { ErrorEvent } from '../events/ErrorEvent';
import { Source } from '../../source/Source';
import { StringSource } from '../../source/StringSource';
import { FileEmitResolver } from '../../chips/FileEmitResolver';
import { Chip } from '../../chips/Chip';

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
  private total: number = 0;
  private writer: FileWriter;
  private resolver: FileEmitResolver;

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
