
import { CoreEvent } from '../../CoreEvent';
import { AbstractConsumer } from '../../AbstractConsumer';

import { CompiledEvent } from '../../events/CompiledEvent';
import { InterpretedEvent } from '../../events/InterpretedEvent';
import { CoreEventBus } from '../../CoreEventBus';
import { ChipTranspiler } from './intentlang/templates/ChipTranspiler';
import { Compiler } from './compiler/Compiler';
import { Sampler } from './compiler/Sampler';
import { Template } from './Template';
import { Substitutor } from './Substitutor';
import { CoreOptions } from '../../../../Core';

export interface InterpreterOptions {
}

export class InterpretConsumer extends AbstractConsumer<CompiledEvent, any>{
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
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent) {
    let { chip } = event.data;
    this.stat(event, {
      type: 'interpret',
      chip,
    });

    let content = this.transpiler.transpile(chip.ast);

    this.emit(new InterpretedEvent({
      chip,
      content: content.join("\n"),
    }));
  }
}
