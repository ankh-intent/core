import { ConsumerStat } from '@intent/kernel';

export class UpdateStat extends ConsumerStat {
    public constructor(public readonly path: string) {
        super();
    }
}
