
import { BaseCoreEvent } from '../CoreEvent';
import { DependencyNode } from '../../watchdog/dependencies/DependencyNode';

export interface CompiledEventProps {
  dependency: DependencyNode;
}

export class CompiledEvent extends BaseCoreEvent<CompiledEventProps> {
}
