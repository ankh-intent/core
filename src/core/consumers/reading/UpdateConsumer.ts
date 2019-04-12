
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { ReadedEvent } from './ReadedEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';
import { ConsumerStat } from '../../kernel/event/consumer/ConsumerStat';

import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { UpdateEvent } from '../watching/UpdateEvent';
import { FileReader } from '../../kernel/source/FileReader';
import { Source } from '../../kernel/source/Source';
import { ErrorEvent } from '../../kernel/event/events/ErrorEvent';
import { SyntaxError } from '../../kernel/parser/SyntaxError';

export class UpdateStat extends ConsumerStat {
  public constructor(public readonly path: string) {
    super();
  }
}

export class UpdateConsumer extends AbstractConsumer<UpdateEvent, any>{
  private readonly reader: FileReader;

  public constructor(bus: CoreEventBus) {
    super(bus);
    this.reader = new FileReader();
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === UpdateEvent.type();
  }

  public process(event: UpdateEvent) {
    let { path } = event.data;
    this.stat(event, new UpdateStat(path));

    this.reader.read(path)
      .then((source: Source) => {
        this.emit(new ReadedEvent({ source }, event));
      })
      .catch((e: Error) => {
        let error = new SyntaxError(e.message, null, 0);
        error.parent = e;

        this.emit(new ErrorEvent({ error }, event));
      })
    ;
  }
}
