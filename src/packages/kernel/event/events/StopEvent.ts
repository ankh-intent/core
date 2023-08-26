import { CoreEvent } from '../../interfaces';
import { BaseCoreEvent } from '../CoreEvent';

export class StopEvent extends BaseCoreEvent {
    constructor(cause?: CoreEvent | null) {
        super(null, cause);
    }
}
