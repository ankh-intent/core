
import { CoreEvent } from '../CoreEvent';
import { CompiledEvent } from '../events/CompiledEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { Chip } from '../../chips/Chip';
import { BaseUseResolver, ResolverOptions, UseResolver } from '../../chips/UseResolver';
import { UpdateEvent } from '../events/UpdateEvent';
import { CoreEventBus } from '../CoreEventBus';

export class CompiledConsumer extends AbstractConsumer<CompiledEvent, any>{
  private nodes: {[path: string]: Chip} = {};
  private resolver: UseResolver;

  public constructor(bus: CoreEventBus, resolverOptions: ResolverOptions) {
    super(bus);
    this.resolver = new BaseUseResolver(resolverOptions);
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent) {
    let { chip } = event.data;
    this.bus.stat({
      type: 'synchronize',
      chip,
    });

    if (!this.nodes[chip.path]) {
      chip = this.add(chip);
    }

    return this.update(event, chip);
  }

  protected add(chip: Chip): Chip {
    this.bus.stat({
      type: 'trace',
      chip,
    });

    for (let key in this.nodes) {
      let node = this.nodes[key];
      let has = node.byPath(chip.path);

      if (has && (has !== chip)) {
        if (node.has(has)) {
          node.link(chip);

          this.bus.stat({
            type: 'link',
            chip,
            parent: node,
          });

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

      if (!link) {
        throw new Error(`Can't resolve chip "${use.qualifier.path('.')}"`);
      }

      if (chip.byPath(link.path)) {
        continue;
      }

      chip.link(link);

      if (!link.name) {
        this.emit(new UpdateEvent({
          path: link.path,
          parent: event,
        }))
      }
    }

    return event;
  }
}
