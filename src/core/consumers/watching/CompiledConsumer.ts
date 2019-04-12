
import { Container } from '../../../intent-utils/Container';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';
import { ConsumerStat } from '../../kernel/event/consumer/ConsumerStat';
import { CompiledEvent } from '../ast-compiling/CompiledEvent';
import { UseResolverInterface } from '../../../intent/chips/use/UseResolverInterface';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { DependencyManager } from '../../kernel/watchdog/dependencies/DependencyManager';
import { TranspilerConfig } from '../../../intent/Transpiler';
import { BaseUseResolver } from '../../../intent/chips/use/BaseUseResolver';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { Objects } from '../../../intent-utils/Objects';
import { UpdateEvent } from './UpdateEvent';
import { DependencyModifiedEvent } from './DependencyModifiedEvent';
import { DependencyNode } from '../../kernel/watchdog/dependencies/DependencyNode';
import { Chip } from '../../../intent/chips/Chip';

export class SynchronizeStat extends ConsumerStat {
  public constructor(public readonly dependency: DependencyNode) {
    super();
  }
}

export class CompiledConsumer extends AbstractConsumer<CompiledEvent, any>{
  private readonly resolver: UseResolverInterface;
  private readonly tree: DependencyManager;

  public constructor(bus: CoreEventBus, config: TranspilerConfig, tree: DependencyManager) {
    super(bus);
    this.resolver = new BaseUseResolver(config);
    this.tree = tree;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent) {
    let { dependency } = event.data;

    this.synchronize(dependency, event);

    return new DependencyModifiedEvent(
      { dependency },
      event,
    );
  }

  private synchronize(node: DependencyNode, event: CoreEvent<any>) {
    this.stat(event, new SynchronizeStat(node));

    let uses = this.uses(node.chip);

    let nodes = this.tree.all(Object.keys(uses), false);
    let unknown: DependencyNode[] = [];
    let known: DependencyNode[] = [];

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

    for (let dependency of node) {
      if (known.indexOf(dependency) < 0) {
        // detach old nodes
        this.tree.dereference(node, dependency);
      }
    }

    for (let dependency of unknown) {
      // todo: entry forwarding
      this.emit(new UpdateEvent({ path: dependency.path, entry: '%C' }, event));
    }
  }

  protected uses(chip: Chip): Container<Chip> {
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
