

import { AbstractConsumer } from '../../AbstractConsumer';
import { CompiledEvent } from '../../events/CompiledEvent';
import { UseResolverInterface } from '../../../chips/use/UseResolverInterface';
import { CoreEventBus } from "../../CoreEventBus";
import { DependencyManager } from '../../../watchdog/dependencies/DependecyManager';
import { ResolverOptions } from '../../../chips/ResolverOptions';
import { BaseUseResolver } from "../../../chips/use/BaseUseResolver";
import { CoreEvent } from '../../CoreEvent';
import { Objects } from '../../../../intent-utils/Objects';
import { UpdateEvent } from '../../events/UpdateEvent';
import { DependencyModifiedEvent } from './DependencyModifiedEvent';
import { DependencyNode } from '../../../watchdog/dependencies/DependencyNode';
import { Chip } from '../../../chips/Chip';

export class CompiledConsumer extends AbstractConsumer<CompiledEvent, any>{
  private resolver: UseResolverInterface;
  private tree: DependencyManager;

  public constructor(bus: CoreEventBus, resolverOptions: ResolverOptions, tree: DependencyManager) {
    super(bus);
    this.resolver = new BaseUseResolver(resolverOptions);
    this.tree = tree;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent) {
    let { dependency } = event.data;
    this.stat(event, {
      type: 'synchronize',
      dependency,
    });

    this.synchronize(dependency, event);

    return new DependencyModifiedEvent(
      {dependency},
      event
    );
  }

  private synchronize(node: DependencyNode, event: CoreEvent<any>) {
    let uses = this.uses(node.chip);

    let nodes = this.tree.all(Object.keys(uses), false);
    let unknown: DependencyNode[] = [];
    let known = [];

    for (let dependency of nodes) {
      if (typeof dependency === 'string') {
        // attach new nodes
        unknown.push(
          dependency = this.tree.add(uses[dependency])
        );
      }

      known.push(dependency);
    }

    node.relate(known);

    for (let dependency of unknown) {
      this.emit(new UpdateEvent({
        path: dependency.chip.path,
      }, event))
    }
  }

  protected uses(chip: Chip): {[name: string]: Chip} {
    let links = {};

    for (let use of Objects.iterate(chip.ast.uses)) {
      let link = this.resolver.resolve(chip, use.qualifier);

      if (!link) {
        throw new Error(`Can't resolve chip "${use.qualifier.path('.')}"`);
      }

      links[link.path] = link;
    }

    return links;
  }
}
