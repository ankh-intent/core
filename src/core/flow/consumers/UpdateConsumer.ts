
import { CoreEvent } from '../CoreEvent';
import { SubmitEvent } from '../events/SubmitEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { CoreEventBus } from '../CoreEventBus';
import { UpdateEvent } from '../events/UpdateEvent';
import { FileReader } from "../../source/FileReader";
import { Source } from '../../source/Source';
import { ErrorEvent } from "../events/ErrorEvent";

export class UpdateConsumer extends AbstractConsumer<UpdateEvent, any>{
  private reader: FileReader;

  public constructor(bus: CoreEventBus) {
    super(bus);
    this.reader = new FileReader();
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === UpdateEvent.type();
  }

  public process(event: UpdateEvent) {
    this.bus.stat({
      type: 'update',
      path: event.data.path,
    });

    this.reader.read(event.data.path)
      .then((source: Source) => {
        this.emit(new SubmitEvent({
          source,
        }));
      })
      .catch((error) => {
        this.emit(new ErrorEvent({
          error,
          parent: event,
        }));
      })
    ;
  }
}
