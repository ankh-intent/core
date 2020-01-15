
import { Container } from '@intent/utils';

import { TreeNode } from '../kernel/ast';
import { AbstractConsumer, ConsumerStat, CoreEvent, CoreEventBus } from '../kernel/event';
import { DependencyNode, Identifiable, DependencyManager } from '../kernel/dependencies';
import { CompiledEvent, DependencyModifiedEvent, UpdateEvent } from './flow-events';

export interface DependenciesResolver<N extends TreeNode, T extends Identifiable<N>> {
  resolve(identifiable: T): Container<T>;
}

export class SynchronizeStat<N extends TreeNode, T extends Identifiable<N>> extends ConsumerStat {
  public constructor(public readonly dependency: DependencyNode<N, T>) {
    super();
  }
}

export class CompiledConsumer<N extends TreeNode, T extends Identifiable<N>> extends AbstractConsumer<CompiledEvent<N, T>, any>{
  private readonly resolver: DependenciesResolver<N, T>;
  private readonly tree: DependencyManager<N, T>;

  public constructor(bus: CoreEventBus, resolver: DependenciesResolver<N, T>, tree: DependencyManager<N, T>) {
    super(bus);
    this.resolver = resolver;
    this.tree = tree;
  }

  public supports(event: CoreEvent<any>): boolean {
    return event.type === CompiledEvent.type();
  }

  public process(event: CompiledEvent<N, T>) {
    const { dependency } = event.data;

    this.synchronize(dependency, event);

    return new DependencyModifiedEvent<N, T>(
      { dependency },
      event,
    );
  }

  private synchronize(node: DependencyNode<N, T>, event: CoreEvent<any>) {
    this.stat(event, new SynchronizeStat(node));

    const uses = this.resolver.resolve(node.identifiable);

    const nodes = this.tree.all(Object.keys(uses), false);
    const unknown: DependencyNode<N, T>[] = [];
    const known: DependencyNode<N, T>[] = [];

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
      this.emit(new UpdateEvent({ path: dependency.identifier, entry: '%C' }, event));
    }
  }
}
