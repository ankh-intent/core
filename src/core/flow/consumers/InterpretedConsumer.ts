
import { AbstractConsumer } from '../AbstractConsumer';
import { CoreEvent } from '../CoreEvent';
import { InterpretedEvent } from '../events/InterpretedEvent';
import { CoreEventBus } from '../CoreEventBus';
import { FileWriter } from '../../source/FileWriter';
import { ErrorEvent } from '../events/ErrorEvent';
import { StringSource } from '../../source/StringSource';
import { FileEmitResolver } from '../../chips/FileEmitResolver';

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
    let { chip, content } = event.data;
    let start = +new Date();
    this.stat(event, {
      type: 'emit',
      chip,
      start,
    });

    let resolved = this.resolver.resolve(chip);
    let source = new StringSource(content, resolved);

    this.writer
      .write(source)
      .then(() => {
        this.emit(event, false);

        this.stat(event, {
          type: 'emitted',
          chip,
          source,
          start,
          end: +new Date(),
          index: ++this.total,
        });
      })
      .catch((err) => {
        this.emit(new ErrorEvent({
          error: err,
        }, event))
      })
    ;
  }
}
