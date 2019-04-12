
import { BaseCoreEvent } from '../../kernel/event/CoreEvent';
import { DependencyNode } from '../../kernel/watchdog/dependencies/DependencyNode';

export interface DependencyModifiedEventProps {
  dependency: DependencyNode;
}

export class DependencyModifiedEvent extends BaseCoreEvent<DependencyModifiedEventProps> {
}
