
import { CoreEvent, AbstractConsumer, ConsumerStat, CoreEventBus, ErrorEvent } from '../../kernel/event';
import { StringSource } from '../../kernel/source';
import { ReadedEvent } from './ReadedEvent';

import { UpdateEvent } from '../watching/UpdateEvent';
import { Source, FileReader } from '../../kernel/source';
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
