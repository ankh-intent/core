
import { BaseCoreEvent } from '../../kernel/CoreEvent';
import { DependencyNode } from './watchdog/dependencies/DependencyNode';

export interface DependencyModifiedEventProps {
  dependency: DependencyNode;
}

export class DependencyModifiedEvent extends BaseCoreEvent<DependencyModifiedEventProps> {
}
