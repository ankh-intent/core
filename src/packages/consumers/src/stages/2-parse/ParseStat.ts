import { SourceInterface, ConsumerStat } from '@intent/kernel';

export class ParseStat extends ConsumerStat {
    public constructor(public readonly source: SourceInterface) {
        super();
    }
}
