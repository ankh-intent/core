
import { Container } from '../../utils/Container';
import { AbstractConsumer } from '../../kernel/event/consumer/AbstractConsumer';
import { ConsumerStat } from '../../kernel/event/consumer/ConsumerStat';
import { CompiledEvent } from '../ast-compiling/CompiledEvent';
import { UseResolverInterface } from '../../../../bin/intent/chips/use/UseResolverInterface';
import { CoreEventBus } from '../../kernel/event/CoreEventBus';
import { DependencyManager } from '../../kernel/watchdog/dependencies/DependencyManager';
import { TranspilerConfig } from '../../../../bin/intent/Transpiler';
import { BaseUseResolver } from '../../../../bin/intent/chips/use/BaseUseResolver';
import { CoreEvent } from '../../kernel/event/CoreEvent';
import { Objects } from '../../utils/Objects';
import { UpdateEvent } from './UpdateEvent';
import { DependencyModifiedEvent } from './DependencyModifiedEvent';
import { DependencyNode } from '../../kernel/watchdog/dependencies/DependencyNode';
import { Chip } from '../../../../bin/intent/chips/Chip';

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
    const { dependency } = event.data;

    this.synchronize(dependency, event);

    return new DependencyModifiedEvent(
      { dependency },
      event,
    );
  }

  private synchronize(node: DependencyNode, event: CoreEvent<any>) {
    this.stat(event, new SynchronizeStat(node));

    const uses = this.uses(node.chip);

    const nodes = this.tree.all(Object.keys(uses), false);
    const unknown: DependencyNode[] = [];
    const known: DependencyNode[] = [];

    for (const dependency of nodes) {
      // todo: some type trickery is going on here
      let resolved: any = dependency;

      if (typeof dependency === 'string') {
        // attach new nodes
        unknown.push(
          resolved = this.tree.add(uses[dependency])
        );
      }

      known.push(resolved);
    }

    node.relate(known);

    for (const dependency of node) {
      if (known.indexOf(dependency) < 0) {
        // detach old nodes
        this.tree.dereference(node, dependency);
      }
    }

    for (const dependency of unknown) {
      // todo: entry forwarding
      this.emit(new UpdateEvent({ path: dependency.path, entry: '%C' }, event));
    }
  }

  protected uses(chip: Chip): Container<Chip> {
    const links = {};

    for (const use of Objects.iterate(chip.ast.uses)) {
      const link = this.resolver.resolve(chip, use.qualifier);

      if (!link) {
        throw new Error(`Can't resolve chip "${use.qualifier.path('.')}"`);
      }

      links[link.path] = link;
    }

    return links;
  }
}
