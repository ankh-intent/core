
import { CoreEvent } from '../CoreEvent';
import { CompiledEvent } from '../events/CompiledEvent';
import { AbstractConsumer } from '../AbstractConsumer';

import { Chip } from '../../chips/Chip';
import { ResolverOptions } from '../../chips/ResolverOptions';
import { UseResolverInterface } from '../../chips/use/UseResolverInterface';
import { BaseUseResolver } from '../../chips/use/BaseUseResolver';
import { UpdateEvent } from '../events/UpdateEvent';
import { CoreEventBus } from '../CoreEventBus';
import { NodeCache } from '../../intent/ast/NodeCache';

export class CompiledConsumer extends AbstractConsumer<CompiledEvent, any>{
  private nodes: NodeCache = new NodeCache();
  private resolver: UseResolverInterface;

  public constructor(bus: CoreEventBus, resolverOptions: ResolverOptions) {
    super(bus);
    this.resolver = new BaseUseResolver(resolverOptions);
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent) {
    let { chip } = event.data;
    this.stat(event, {
      type: 'synchronize',
      chip,
    });

    if (!this.nodes.has(chip)) {
      chip = this.add(event, chip);
    }

    return this.update(event, chip);
  }

  protected add(event: CompiledEvent, chip: Chip): Chip {
    this.stat(event, {
      type: 'trace',
      chip,
    });

    for (let node of this.nodes.all()) {
      let has = node.byPath(chip.path);

      if (has && (has !== chip)) {
        if (node.has(has)) {
          node.link(chip);

          this.stat(event, {
            type: 'link',
            chip,
            node: node,
          });

          break;
        }
      }
    }

    return this.nodes.set(chip);
  }

  protected update(event: CompiledEvent, chip: Chip) {
    let old = this.nodes.get(chip.path);

    if (old) {
      for (let path in old.linked) {
        if (old.linked[path] && !chip.linked[path]) {
          chip.link(old.linked[path])
        }
      }
    }

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
        }, event))
      }
    }

    return event;
  }
}
