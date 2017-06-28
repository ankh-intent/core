
import { CoreEvent } from '../../CoreEvent';
import { AbstractConsumer } from '../../AbstractConsumer';

import { CompiledEvent } from '../../events/CompiledEvent';
import { InterpretedEvent } from '../../events/InterpretedEvent';
import { StringSource } from '../../../source/StringSource';
import { CoreEventBus } from '../../CoreEventBus';
import { ChipTranspiler } from './intentlang/templates/ChipTranspiler';
import { Compiler } from './compiler/Compiler';
import { Sampler } from './compiler/Sampler';
import { Template } from './Template';
import { Substitutor } from './Substitutor';

export class InterpretConsumer extends AbstractConsumer<CompiledEvent, any>{
  private compiler: Compiler<any, string[]>;
  private sampler: Sampler;
  private substitutor: Substitutor<any>;

  public constructor(bus: CoreEventBus) {
    super(bus);
    this.sampler = new Sampler('{%', '%}');
    this.substitutor = new Substitutor(this.sampler);
    this.compiler = new Compiler(
      this.sampler,
      (code) => new Template(code, this.substitutor)
    )
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

    let resolved = chip.path.replace(/\.int$/, '.i.js');
    let content = (new ChipTranspiler(
      this.compiler
    )).transpile(chip.ast);

    return new InterpretedEvent({
      chip,
      content: new StringSource(
        content.join("\n"),
        resolved
      ),
    });
  }
}