
import { CoreEvent } from '../../kernel/CoreEvent';
import { SubmitEvent } from './SubmitEvent';
import { AbstractConsumer } from '../../kernel/AbstractConsumer';
import { ConsumerStat } from '../../kernel/ConsumerStat';

import { CoreEventBus } from '../../kernel/CoreEventBus';
import { UpdateEvent } from '../watching/UpdateEvent';
import { FileReader } from "./source/FileReader";
import { Source } from './source/Source';
import { ErrorEvent } from "../../kernel/events/ErrorEvent";
import { SyntaxError } from '../parsing/parser/SyntaxError';

export class UpdateStat extends ConsumerStat {
  public constructor(public readonly path: string) {
    super();
  }
}

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
    let { path } = event.data;
    this.stat(event, new UpdateStat(path));

    this.reader.read(path)
      .then((source: Source) => {
        this.emit(new SubmitEvent({ source }, event));
      })
      .catch((e: Error) => {
        let error = new SyntaxError(e.message, null, 0);
        error.parent = e;

        this.emit(new ErrorEvent({ error }, event));
      })
    ;
  }
}
