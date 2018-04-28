
import { BaseCoreEvent } from '../../kernel/CoreEvent';
import { DependencyNode } from '../../kernel/watchdog/dependencies/DependencyNode';

export interface DependencyModifiedEventProps {
  dependency: DependencyNode;
}

export class DependencyModifiedEvent extends BaseCoreEvent<DependencyModifiedEventProps> {
}
