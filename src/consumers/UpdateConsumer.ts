
import { StringSource, Source, FileReader } from '@intent/source';
import { SyntaxError } from '@intent/parser';

import { CoreEvent, AbstractConsumer, ConsumerStat, CoreEventBus, ErrorEvent } from '../kernel/event';
import { ReadedEvent, UpdateEvent } from './flow-events';

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
    const { path } = event.data;
    this.stat(event, new UpdateStat(path));

    this.reader.read(path)
      .then((source: Source) => {
        this.emit(new ReadedEvent({ source }, event));
      })
      .catch((e: Error) => {
        this.emit(new ErrorEvent({ error: new SyntaxError(e.message, new StringSource('', path), 0, e) }, event));
      })
    ;
  }
}
