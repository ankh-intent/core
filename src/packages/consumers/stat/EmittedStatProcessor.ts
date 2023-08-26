import { Strings, Logger } from '@intent/utils';
import { SourceInterface } from '@intent/source';
import { CoreEvent, StatEvent, CoreStatProcessor } from '@intent/kernel';

import { EmittedStat } from '../stages';

export class EmittedStatProcessor implements CoreStatProcessor<'emitted', EmittedStat<any, any>> {
    private readonly logger: Logger;
    private readonly commonPaths: string[];

    public constructor(logger: Logger, commonPaths: string[]) {
        this.logger = logger;
        this.commonPaths = commonPaths;
    }

    public process(event: StatEvent<'emitted', EmittedStat<any, any>>, { identifiable, index, source, start, end }) {
        const path = (<SourceInterface>source).reference;
        const common = Strings.commonPath([path, ...this.commonPaths]);
        let cause = '<root>';
        let parent: CoreEvent | null = event;

        while (parent) {
            parent = parent.parent;

            if (parent) {
                const data: any = parent.data;

                if (data.identifiable && (data.identifiable !== identifiable)) {
                    cause = data.identifiable.name;
                    break;
                }
            }
        }

        const indexS = Strings.pad(String(index), 5, ' ', true);
        const causeS = Strings.shrink(cause, 10, true);
        const pathS = Strings.shrink(Strings.stripLeft(path, `${common}/`), 60);
        const timeS = Strings.shrink(`~${String(end - start)}`, 6, true);

        this.logger.log(Logger.INFO, `${indexS} [${causeS}] ${pathS} ${timeS} ms`);

        return event;
    }
}
