
import { TreeNode } from '@intent/kernel/ast/TreeNode';
import { TranspilerInterface } from '../../kernel/transpiler/AbstractTranspiler';
import { Identifiable } from '../../kernel/watchdog/dependencies/DependencyNode';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';

import { InterpretedEvent } from './InterpretedEvent';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { CoreConfig } from '../../Core';
import { DependencyModifiedEvent } from '../watching/DependencyModifiedEvent';

export interface InterpreterConfig {
}

export class DependencyModifiedConsumer<N extends TreeNode, T extends Identifiable<N>> extends AbstractConsumer<DependencyModifiedEvent<N, T>, any>{
  private readonly config: CoreConfig;
  private readonly transpiler: TranspilerInterface<N>;

  public constructor(bus: CoreEventBus, transpiler: TranspilerInterface<N>, config: CoreConfig) {
    super(bus);
    this.config = config;
    this.transpiler = transpiler;
  }

  public supports(event: CoreEvent<any>): boolean {
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
