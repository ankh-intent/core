import { Logger } from '@intent/utils';

import { CoreStatProcessor, CoreStat, CoreEvent } from '../interfaces';

export interface LogStatData {
    message: object;
}

export class LogStat implements CoreStatProcessor<'log', LogStatData> {
    private readonly logger: Logger;

    public constructor(logger: Logger) {
        this.logger = logger;
    }

    public process(event: CoreEvent<CoreStat<'log', LogStatData>>, data: LogStatData) {
        for (const [type, message] of Object.entries(data.message)) {
            this.logger.log(Logger.strToLevel(type), event, message[type]);
        }

        return event;
    }
}
