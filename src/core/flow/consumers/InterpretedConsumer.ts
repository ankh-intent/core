
import { AbstractConsumer } from '../AbstractConsumer';
import { CoreEvent } from '../CoreEvent';
import { InterpretedEvent } from '../events/InterpretedEvent';
import { CoreEventBus } from '../CoreEventBus';
import { FileWriter } from '../../source/FileWriter';
import { ErrorEvent } from '../events/ErrorEvent';

export class InterpretedConsumer extends AbstractConsumer<InterpretedEvent, any>{
  private writer: FileWriter;
  private total: number = 0;

  public constructor(bus: CoreEventBus, writer: FileWriter) {
    super(bus);
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

    this.writer.write(content)
      .then(() => {
        this.emit(event, false);

        this.stat(event, {
          type: 'emitted',
          chip,
          content,
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
