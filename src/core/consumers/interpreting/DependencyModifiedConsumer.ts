
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';

import { InterpretedEvent } from './InterpretedEvent';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { ChipTranspiler } from './intentlang/templates/ChipTranspiler';
import { Compiler } from './transpiler/compiler/Compiler';
import { Sampler } from './transpiler/compiler/Sampler';
import { Template } from './transpiler/compiler/Template';
import { Substitutor } from './transpiler/compiler/Substitutor';
import { CoreOptions } from '../../../Core';
import { DependencyModifiedEvent } from '../watching/DependencyModifiedEvent';

export interface InterpreterOptions {
}

export class DependencyModifiedConsumer extends AbstractConsumer<DependencyModifiedEvent, any>{
  private compiler: Compiler<any, string[]>;
  private sampler: Sampler;
  private substitutor: Substitutor<any>;
  private options: CoreOptions;
  private transpiler: ChipTranspiler;

  public constructor(bus: CoreEventBus, options: CoreOptions) {
    super(bus);
    this.options = options;
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
    let { dependency } = event.data;
    this.stat(event, {
      type: 'interpret',
      dependency,
    });

    let content = this.transpiler.transpile(dependency.chip.ast);

    return new InterpretedEvent({
      dependency,
      content: content.join("\n"),
    });
  }
}
