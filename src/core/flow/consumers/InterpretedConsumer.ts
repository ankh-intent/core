
import { AbstractConsumer } from '../AbstractConsumer';
import { CoreEvent } from '../CoreEvent';
import { InterpretedEvent } from '../events/InterpretedEvent';
import { CoreEventBus } from '../CoreEventBus';
import { FileWriter } from '../../source/FileWriter';
import { ErrorEvent } from '../events/ErrorEvent';

export class InterpretedConsumer extends AbstractConsumer<InterpretedEvent, any>{
  private writer: FileWriter;

  public constructor(bus: CoreEventBus, writer: FileWriter) {
    super(bus);
    this.writer = writer;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === InterpretedEvent.type();
  }

  public process(event: InterpretedEvent) {
    let { chip, content } = event.data;
    this.bus.stat({
      type: 'emit',
      chip,
    });

    this.writer.write(content)
      .then(() => {
        this.bus.stat({
          type: 'emitted',
          chip,
        });
      })
      .catch((err) => {
        this.emit(new ErrorEvent({
          error: err,
          parent: event,
        }))
      })
    ;
  }
}
