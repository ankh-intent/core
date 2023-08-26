import { CoreStat, CoreEvent } from '../../interfaces';
import { BaseCoreEvent } from '../CoreEvent';

export class StatEvent<T, S> extends BaseCoreEvent<CoreStat<T, S>> {
    constructor(parent: CoreEvent | null, stat: CoreStat<T, S>) {
        super(stat, parent);
    }
}
