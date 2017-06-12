
import { CoreEvent } from '../CoreEvent';
import { CompiledEvent } from '../events/CompiledEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { Chip } from '../../chips/Chip';
import { BaseUseResolver, UseResolver } from '../../chips/UseResolver';
import { UpdateEvent } from '../events/UpdateEvent';
import { ErrorEvent } from '../events/ErrorEvent'

export class CompiledConsumer extends AbstractConsumer<CompiledEvent, any>{
  private nodes: {[path: string]: Chip} = {};
  private resolver: UseResolver = new BaseUseResolver();

  public supports(event: CoreEvent<any>): boolean {
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent) {
    let { chip } = event.data;
    this.bus.stat({
      type: 'synchronize',
      chip,
    });

    if (!chip.name) {
      chip = this.add(chip);
    }

    return this.update(event, chip);
  }

  protected add(chip: Chip): Chip {
    console.log('new chip', chip.path);

    for (let key in this.nodes) {
      let node = this.nodes[key];
      let has = node.byPath(chip.path);

      if (has && (has !== chip)) {
        if (node.has(has)) {
          node.link(chip);
          console.log('  linked to', node.path, 'as', chip.name);

          break;
        }
      }
    }

    return this.nodes[chip.path] = chip;
  }

  protected update(event: CompiledEvent, chip: Chip) {
    for (let alias in chip.ast.uses) {
      let use = chip.ast.uses[alias];
      let link = this.resolver.resolve(chip, use.qualifier);
      console.log('resolving', use, link);

      if (!link) {
        return new ErrorEvent({
          error: new Error(`Can't resolve chip "${use.qualifier.path('.')}"`),
          parent: event,
        });
      }

      if (chip.byPath(link.path)) {
        console.log('  already done');
        continue;
      }

      if (!link.name) {
        console.log('  requesting', link.path);

        this.emit(new UpdateEvent({
          path: link.path,
          parent: event,
        }))
      }
    }
  }
}
