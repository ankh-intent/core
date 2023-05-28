import { PatchedASTEvent, SynchronizeStat } from '@intent/consumers';
import { DependencyManager, DependencyNode, UpdateEvent } from '@intent/kernel';
import { PluginEnvironment, InterpretPlugin } from '@intent/plugins';
import { Container } from '@intent/utils';

import { Module, UseResolverInterface } from '../modules';
import { ModuleNode, DomainNode, UsesNode } from './ast';

export class DependencyResolvingPlugin extends InterpretPlugin<ModuleNode, Module, DependencyNode<ModuleNode, Module>> {
    private readonly tree: DependencyManager<ModuleNode, Module>;
    private readonly resolver: UseResolverInterface;

    constructor(tree: DependencyManager<ModuleNode, Module>, resolver: UseResolverInterface) {
        super();
        this.tree = tree;
        this.resolver = resolver;
    }

    protected createContext(env) {
        return env.event.data.dependency;
    }

    protected visitRoot(env: PluginEnvironment<PatchedASTEvent<ModuleNode, Module>>, root, node): boolean | void {
        env.events.stat(new SynchronizeStat(node), env.event);

        const uses = this.resolve(node.identifiable);

        const nodes = this.tree.all(Object.keys(uses), false);
        const unknown: DependencyNode<ModuleNode, Module>[] = [];
        const known: DependencyNode<ModuleNode, Module>[] = [];

        for (const dependency of nodes) {
            // todo: some type trickery is going on here
            let resolved: any = dependency;

            if (typeof dependency === 'string') {
                // attach new nodes
                unknown.push(
                    resolved = this.tree.add(uses[dependency]),
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
            env.events.emit(new UpdateEvent({ event: 'change', path: dependency.uri, entry: '%C' }, env.event));
        }
    }

    resolve(module: Module): Container<Module> {
        return (
            module.ast
                ? this.mergeUses(
                    this.resolveUsedModules(module, module.ast.uses),
                    this.resolveDomainUses(module, module.ast.domain),
                )
                : {}
        );
    }

    mergeUses(a?: Container<Module>, b?: Container<Module>): Container<Module> {
        return {
            ...a,
            ...b,
        };
    }

    resolveDomainUses(module: Module, domain: DomainNode): Container<Module> {
        const own = this.resolveUsedModules(module, domain.uses);
        const result: Container<Module>[] = [];

        for (const sub of domain.domains.values()) {
            result.push(this.resolveUsedModules(module, sub.uses));
        }

        return result.reduce((a, b) => this.mergeUses(a, b), own);
    }

    resolveUsedModules(module: Module, uses: UsesNode): Container<Module> {
        const links = {};

        for (const [alias, use] of uses.entries) {
            const link = this.resolver.resolve(module, use.qualifier);

            if (!link) {
                throw new Error(`Can't resolve module "${use.qualifier.path('.')}"`);
            }

            links[link.uri] = link;
        }

        return links;
    }
}
