
import { BaseCoreEvent } from '../CoreEvent';
import { DependencyNode } from '../../watchdog/dependencies/DependencyNode';

export interface InterpretedEventProps {
  content: string;
  dependency: DependencyNode;
}

export class InterpretedEvent extends BaseCoreEvent<InterpretedEventProps> {
}
