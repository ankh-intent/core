
import { BaseCoreEvent } from '../../kernel/CoreEvent';
import { DependencyNode } from '../watching/watchdog/dependencies/DependencyNode';

export interface InterpretedEventProps {
  content: string;
  dependency: DependencyNode;
}

export class InterpretedEvent extends BaseCoreEvent<InterpretedEventProps> {
}
