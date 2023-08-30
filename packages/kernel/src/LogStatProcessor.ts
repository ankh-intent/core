import { Logger, LogTypeName } from '@intent/utils';

import { CoreStatProcessor, CoreStat, CoreEvent } from './interfaces';

export interface LogStatData {
    message: Record<LogTypeName, any>;
}

export class LogStatProcessor implements CoreStatProcessor<'log', LogStatData> {
    private readonly logger: Logger;

    public constructor(logger: Logger) {
        this.logger = logger;
    }

    public process(event: CoreEvent<CoreStat<'log', LogStatData>>, data: LogStatData) {
        for (const [type, message] of Object.entries(data.message) as [LogTypeName, any][]) {
            if (Logger.strToLevel(type)) {
                this.logger.log(type, event, message);
            } else {
                this.logger.log(Logger.TRACE, 'Misconfigured log of type "%s": %o', type, message);
            }
        }

        return event;
    }
}
