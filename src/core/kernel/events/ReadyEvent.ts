
import { BaseCoreEvent } from '../CoreEvent';
import { EventChainMonitoringData } from '../EventChainMonitor';

export interface ReadyEventProps extends EventChainMonitoringData {
}

export class ReadyEvent extends BaseCoreEvent<ReadyEventProps> {
}
