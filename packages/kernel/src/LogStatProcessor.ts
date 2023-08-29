import { Logger } from '@intent/utils';

import { CoreStatProcessor, CoreStat, CoreEvent } from './interfaces';

export interface LogStatData {
    message: object;
}

export class LogStatProcessor implements CoreStatProcessor<'log', LogStatData> {
    private readonly logger: Logger;

    public constructor(logger: Logger) {
        this.logger = logger;
    }

    public process(event: CoreEvent<CoreStat<'log', LogStatData>>, data: LogStatData) {
        for (const [type, message] of Object.entries(data.message)) {
            const level = Logger.strToLevel(type);

            if (level) {
                this.logger.log(level, event, message);
            } else {
                this.logger.log(Logger.WARNING, 'Misconfigured log of type "%s": %o', type, message);
            }
        }

        return event;
    }
}
