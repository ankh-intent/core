import { Logger } from '@intent/utils';
import { CoreEvent, AbstractConsumer, StatEvent, CoreEventBus, LogStatProcessor, CoreStatProcessor } from '@intent/kernel';

import { EmittedStatProcessor } from './stat/EmittedStatProcessor';

export class StatConsumer extends AbstractConsumer<StatEvent<any, any>, any> {
    private readonly processors: Record<string, CoreStatProcessor<any, any>>;

    public constructor(bus: CoreEventBus, logger: Logger, commonPaths: string[]) {
        super(bus);
        this.processors = {
            log: new LogStatProcessor(logger),
            emitted: new EmittedStatProcessor(logger, commonPaths),
        };
    }

    public supports(event: CoreEvent): boolean {
        return event.type === StatEvent.type();
    }

    public process(event: StatEvent<any, any>) {
        const { type, ...data } = event.data;
        const processor = this.processors[type];

        return (
            processor?.process(event, data) || event
        );
    }
}
