import {
    SyntaxError,
    StringSource,
    SourceInterface,
    FileReader,
    CoreEvent,
    AbstractConsumer,
    CoreEventBus,
    ErrorEvent,
    UpdateEvent,
} from '@intent/kernel';

import { ReadedEvent } from '../../flow-events';
import { UpdateStat } from './UpdateStat';

export class ReadAfterUpdate extends AbstractConsumer<UpdateEvent, any> {
    private readonly reader: FileReader;

    public constructor(bus: CoreEventBus) {
        super(bus);
        this.reader = new FileReader();
    }

    public supports(event: CoreEvent): boolean {
        return event.type === UpdateEvent.type();
    }

    public process(event: UpdateEvent) {
        const { data: { path, reference } } = event;
        this.stat(event, new UpdateStat(path));

        this.reader.read(path)
            .then((source: SourceInterface) => {
                this.emit(new ReadedEvent({ source }, event));
            })
            .catch((e: Error) => {
                const source = reference?.source || new StringSource('', path);
                const pos = reference?.source.position(reference) || 0;

                this.emit(new ErrorEvent({ error: new SyntaxError(e.message, 'read(source)', source, pos, e) }, event));
            })
        ;
    }
}
