
import { Source } from '../../source/Source';
import { BaseCoreEvent } from '../CoreEvent';

export interface SubmitEventProps {
  source: Source;
}

export class SubmitEvent extends BaseCoreEvent<SubmitEventProps> {
}

