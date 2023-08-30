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
    ReadedEvent,
} from '@intent/kernel';

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
                const pos = source.positional(reference || 0);

                this.emit(new ErrorEvent({ error: new SyntaxError(e.message, 'read(source)', pos, e) }, event));
            })
        ;
    }
}
