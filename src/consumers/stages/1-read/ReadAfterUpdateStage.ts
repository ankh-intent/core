import { SyntaxError } from '@intent/parser';
import { StringSource, Source, FileReader } from '@intent/source';

import { CoreEvent, AbstractConsumer, CoreEventBus, ErrorEvent, UpdateEvent } from '../../../kernel';
import { ReadedEvent } from '../../flow-events';
import { UpdateStat } from './UpdateStat';

export class ReadAfterUpdateStage extends AbstractConsumer<UpdateEvent, any>{
  private readonly reader: FileReader;

  public constructor(bus: CoreEventBus) {
    super(bus);
    this.reader = new FileReader();
  }

  public supports(event: CoreEvent): boolean {
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
        this.emit(new ErrorEvent({ error: new SyntaxError(e.message, 'read(source)', new StringSource('', path), 0, e) }, event));
      })
    ;
  }
}
