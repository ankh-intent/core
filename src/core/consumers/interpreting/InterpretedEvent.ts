
import { BaseCoreEvent } from '../../kernel/CoreEvent';
import { DependencyNode } from '../../kernel/watchdog/dependencies/DependencyNode';

export interface InterpretedEventProps {
  content: string;
  dependency: DependencyNode;
}

export class InterpretedEvent extends BaseCoreEvent<InterpretedEventProps> {
}
