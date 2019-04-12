
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';

import { InterpretedEvent } from './InterpretedEvent';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { ChipTranspiler } from '../../../../bin/intent/transpiler/templates/ChipTranspiler';
import { Compiler } from '../../kernel/transpiler/compiler/Compiler';
import { Sampler } from '../../kernel/transpiler/compiler/Sampler';
import { Template } from '../../kernel/transpiler/compiler/Template';
import { Substitutor } from '../../kernel/transpiler/compiler/Substitutor';
import { CoreConfig } from '../../Core';
import { DependencyModifiedEvent } from '../watching/DependencyModifiedEvent';

export interface InterpreterConfig {
}

export class DependencyModifiedConsumer extends AbstractConsumer<DependencyModifiedEvent, any>{
  private readonly compiler: Compiler<any, string[]>;
  private readonly sampler: Sampler;
  private readonly substitutor: Substitutor<any>;
  private readonly config: CoreConfig;
  private readonly transpiler: ChipTranspiler;

  public constructor(bus: CoreEventBus, config: CoreConfig) {
    super(bus);
    this.config = config;
    this.sampler = new Sampler('{%', '%}');
    this.substitutor = new Substitutor(this.sampler);
    this.compiler = new Compiler(
      this.sampler,
      (code, resolver) => (
        new Template(code, this.substitutor, resolver)
      )
    );
    this.transpiler = new ChipTranspiler(this.compiler);
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === DependencyModifiedEvent.type();
  }

  public process(event: DependencyModifiedEvent) {
    const { dependency } = event.data;
    this.stat(event, {
      type: 'interpret',
      dependency,
    });

    const content = this.transpiler.transpile(dependency.chip.ast);

    return new InterpretedEvent({
      dependency,
      content: content.join("\n"),
    });
  }
}
