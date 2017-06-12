
import { CoreEvent } from '../CoreEvent';
import { ParsedEvent } from '../events/ParsedEvent';
import { AbstractConsumer } from '../AbstractConsumer';
import { CompiledEvent } from '../events/CompiledEvent';
import { Chip } from '../../chips/Chip';
import { ChipNode } from '../../intent/ast/ChipNode';

export class ParsedConsumer extends AbstractConsumer<ParsedEvent<ChipNode>, any>{

  public supports(event: CoreEvent<any>): boolean {
    return event.type === ParsedEvent.type();
  }

  public process(event: ParsedEvent<ChipNode>) {
    let { source, ast } = event.data;
    this.bus.stat({
      type: 'compile',
      path: source,
    });

    let chip = new Chip(source.reference);
    chip.name = ast.name;
    chip.ast = ast;

    return new CompiledEvent({
      chip,
    });
  }
}
