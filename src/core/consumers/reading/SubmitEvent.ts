
import { Source } from './source/Source';
import { BaseCoreEvent } from '../../kernel/CoreEvent';

export interface SubmitEventProps {
  source: Source;
}

export class SubmitEvent extends BaseCoreEvent<SubmitEventProps> {
}

