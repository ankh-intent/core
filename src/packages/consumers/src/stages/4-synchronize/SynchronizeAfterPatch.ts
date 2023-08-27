import { Container } from '@intent/utils';
import {
    TreeNode,
    Identifiable,
    DependencyNode,
    DependencyManager,
    AbstractConsumer,
    CoreEvent,
    CoreEventBus,
    UpdateEvent,
} from '@intent/kernel';

import { PatchedASTEvent, DependencyModifiedEvent } from '../../flow-events';
import { SynchronizeStat } from './SynchronizeStat';

export interface DependenciesResolver<N extends TreeNode, T extends Identifiable<N>> {
    resolve(identifiable: T): Container<T>;
}

export class SynchronizeAfterPatch<N extends TreeNode, T extends Identifiable<N>> extends AbstractConsumer<PatchedASTEvent<N, T>, any> {
    private readonly resolver: DependenciesResolver<N, T>;
    private readonly tree: DependencyManager<N, T>;

    public constructor(bus: CoreEventBus, resolver: DependenciesResolver<N, T>, tree: DependencyManager<N, T>) {
        super(bus);
        this.resolver = resolver;
        this.tree = tree;
    }

    public supports(event: CoreEvent): boolean {
        return event.type === PatchedASTEvent.type();
    }

    public process(event: PatchedASTEvent<N, T>) {
        const { dependency } = event.data;

        this.synchronize(dependency, event);

        return new DependencyModifiedEvent<N, T>(
            { dependency },
            event,
        );
    }

    private synchronize(node: DependencyNode<N, T>, event: CoreEvent) {
        this.stat(event, new SynchronizeStat(node));

        const uses = this.resolver.resolve(node.identifiable);

        const nodes = this.tree.all(Object.keys(uses), false);
        const unknown: DependencyNode<N, T>[] = [];
        const known: DependencyNode<N, T>[] = [];

        for (const dependency of nodes) {
            if (typeof dependency === 'string') {
                const resolved = this.tree.add(uses[dependency]);

                // attach new nodes
                unknown.push(resolved);
                known.push(resolved);
            } else {
                known.push(dependency);
            }
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
            this.emit(new UpdateEvent({ event: 'change', path: dependency.uri, entry: '%C' }, event));
        }
    }
}
