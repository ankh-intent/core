import { ConsumerStat } from '../../../kernel';

export class UpdateStat extends ConsumerStat {
    public constructor(public readonly path: string) {
        super();
    }
}
