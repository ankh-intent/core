
import { AbstractConsumer } from '../AbstractConsumer';
import { CoreEvent } from '../CoreEvent';
import { InterpretedEvent } from '../events/InterpretedEvent';

export class InterpretedConsumer extends AbstractConsumer<InterpretedEvent, any>{
  public supports(event: CoreEvent<any>): boolean {
    return event.type === InterpretedEvent.type();
  }

  public process(event: InterpretedEvent) {
    console.log(event.data.content);
  }
}
