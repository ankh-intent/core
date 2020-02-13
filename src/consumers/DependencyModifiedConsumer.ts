import { CoreConfig } from '../CoreConfig';
import { TreeNode } from '../kernel/ast';
import { TranspilerInterface } from '../kernel/transpiler';
import { Identifiable } from '../kernel/dependencies';
import { CoreEvent, AbstractConsumer, CoreEventBus } from '../kernel/event';

import { InterpretedEvent, DependencyModifiedEvent } from './flow-events';

export class DependencyModifiedConsumer<N extends TreeNode, T extends Identifiable<N>> extends AbstractConsumer<DependencyModifiedEvent<N, T>, any>{
  private readonly config: CoreConfig;
  private readonly transpiler: TranspilerInterface<N>;

  public constructor(bus: CoreEventBus, transpiler: TranspilerInterface<N>, config: CoreConfig) {
    super(bus);
    this.config = config;
    this.transpiler = transpiler;
  }

  public supports(event: CoreEvent): boolean {
    return event.type === DependencyModifiedEvent.type();
  }

  public process(event: DependencyModifiedEvent<N, T>) {
    const { dependency } = event.data;
    this.stat(event, {
      type: 'interpret',
      dependency,
    });

    const content = this.transpiler.transpile(dependency.identifiable.ast);

    return new InterpretedEvent({
      dependency,
      content: content.join('\n'),
    });
  }
}
