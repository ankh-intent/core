import { SynchronizeStat, DependencyManager, DependencyNode, UpdateEvent } from '@intent/kernel';
import { PatchedASTEvent } from '@intent/consumers';
import { PluginEnvironment, PatchPlugin } from '@intent/plugins';

import { Module, LinkedModulesResolverInterface } from '@alchemy/modules';
import { ModuleNode } from '@alchemy/ast';

export class DependencyResolvingPlugin extends PatchPlugin<ModuleNode, Module, DependencyNode<ModuleNode, Module>> {
    private readonly tree: DependencyManager<ModuleNode, Module>;
    private readonly resolver: LinkedModulesResolverInterface<Module>;

    constructor(resolver: LinkedModulesResolverInterface<Module>, tree: DependencyManager<ModuleNode, Module>) {
        super();
        this.resolver = resolver;
        this.tree = tree;
    }

    protected createContext(env: PluginEnvironment<PatchedASTEvent<ModuleNode, Module>>): DependencyNode<ModuleNode, Module> {
        return env.event.data.dependency;
    }

    protected visitRoot(
        env: PluginEnvironment<PatchedASTEvent<ModuleNode, Module>>,
        _root: ModuleNode,
        node: DependencyNode<ModuleNode, Module>
    ): boolean | void {
        env.stat(new SynchronizeStat(node));

        const uses = this.resolver.resolve(node.identifiable);
        const nodes = this.tree.all(Object.keys(uses), false);

        const unknown: DependencyNode<ModuleNode, Module>[] = [];
        const known: DependencyNode<ModuleNode, Module>[] = [];

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
            env.events.emit(new UpdateEvent({ event: 'change', path: dependency.uri, entry: '%C' }, env.event));
        }
    }
}
