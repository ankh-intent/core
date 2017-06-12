
import { CoreEvent } from '../CoreEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { CompiledEvent } from '../events/CompiledEvent';
import { InterpretedEvent } from '../events/InterpretedEvent';
import { StringSource } from '../../source/StringSource';
import { ChipTranspiler } from '../../intent/transpiler/ChipTranspiler';

export class InterpretConsumer extends AbstractConsumer<CompiledEvent, any>{
  private transpiler: ChipTranspiler = new ChipTranspiler();

  public supports(event: CoreEvent<any>): boolean {
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent) {
    let { chip } = event.data;
    this.stat(event, {
      type: 'interpret',
      chip,
    });

    let resolved = chip.path.replace(/\.int$/, '.js');

    return new InterpretedEvent({
      chip,
      content: new StringSource(
        this.transpiler.process(chip.ast),
        resolved
      ),
    });
  }
}
