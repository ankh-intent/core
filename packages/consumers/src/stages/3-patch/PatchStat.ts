import { SourceInterface, ConsumerStat } from '@intent/kernel';

export class PatchStat extends ConsumerStat {
    public constructor(public readonly source: SourceInterface) {
        super();
    }
}
