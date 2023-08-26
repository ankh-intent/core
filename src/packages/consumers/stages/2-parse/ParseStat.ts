import { SourceInterface } from '@intent/source';
import { ConsumerStat } from '@intent/kernel';

export class ParseStat extends ConsumerStat {
    public constructor(public readonly source: SourceInterface) {
        super();
    }
}
