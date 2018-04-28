
import { BaseCoreEvent } from '../../kernel/event/CoreEvent';
import { DependencyNode } from '../watching/watchdog/dependencies/DependencyNode';

export interface CompiledEventProps {
  dependency: DependencyNode;
}

export class CompiledEvent extends BaseCoreEvent<CompiledEventProps> {
}
