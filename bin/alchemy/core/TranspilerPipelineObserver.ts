import { Container } from '@intent/utils';
import { Source } from '@intent/source';
import { TranspilerConfig, WatchedTranspilerPipelineObserver, Core } from '@intent/pipeline';

import { Module } from './modules';
import { QualifierResolver, BaseUseResolver } from './modules';
import { AlchemyTokenMatcher } from './transpiler/Alchemy';
import { ModuleNode, DomainNode, UsesNode } from './transpiler/ast';
import { AlchemyBuilder } from './transpiler/builder/AlchemyBuilder';
import { DependencyResolvingPlugin } from './transpiler/DependencyResolvingPlugin';
import { TranslatorPlugin } from './transpiler/TranslatorPlugin';

export class TranspilerPipelineObserver extends WatchedTranspilerPipelineObserver<ModuleNode, Module> {
    private readonly qualifierResolver: QualifierResolver;
    private readonly useResolver: BaseUseResolver;

    public constructor(config: TranspilerConfig) {
        super(
            config,
            (source: Source) => new AlchemyTokenMatcher(source, source.range()),
            new AlchemyBuilder(),
        );
        this.qualifierResolver = new QualifierResolver(config.paths);
        this.useResolver = new BaseUseResolver(config.paths, this);
    }

    bootstrap(core: Core<TranspilerConfig, ModuleNode, Module>, config: TranspilerConfig): void {
        core.registerPlugin(new DependencyResolvingPlugin(this.dependencyTree, this.useResolver));
        core.registerPlugin(new TranslatorPlugin(this, this.dependencyTree));

        super.bootstrap(core, config);
    }

    create(identifier: string): Module {
        const qualifier = this.qualifierResolver.resolve(identifier);

        if (qualifier) {
            return new Module(identifier, qualifier);
        }

        throw new Error(`Can't resolve qualifier for "${identifier}"`);
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
            const link = this.useResolver.resolve(module, use.qualifier);

            if (!(link && link.qualifier)) {
                throw new Error(`Can't resolve module "${use.qualifier.path('.')} as ${alias}"`);
            }

            links[link.uri] = link;
        }

        return links;
    }
}
