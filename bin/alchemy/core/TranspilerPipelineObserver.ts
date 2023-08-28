import { Container } from '@intent/kernel';
import { SourceInterface } from '@intent/kernel';
import { TranspilerConfig, WatchedTranspilerPipelineObserver, Core } from '@intent/pipeline';

import {
    Module,
    QualifierResolver,
    BaseUseResolver,
    LinkedModulesResolverInterface,
    Qualifier,
} from '@alchemy/modules';
import { ModuleNode, DomainNode, UsesNode } from '@alchemy/ast';
import { AlchemyTokenMatcher, AlchemyBuilder, DependencyResolvingPlugin, TranslatorPlugin } from '@alchemy/transpiler';

export class TranspilerPipelineObserver
    extends WatchedTranspilerPipelineObserver<ModuleNode, Module>
    implements LinkedModulesResolverInterface<Module>
{
    private readonly qualifierResolver: QualifierResolver;
    private readonly useResolver: BaseUseResolver;

    public constructor(config: TranspilerConfig) {
        super(
            (source: SourceInterface) => new AlchemyTokenMatcher(source, source.range()),
            new AlchemyBuilder(),
            config.emit.files,
        );
        this.qualifierResolver = new QualifierResolver(config.paths);
        this.useResolver = new BaseUseResolver(config.paths, this);
    }

    bootstrap(core: Core<TranspilerConfig, ModuleNode, Module>, config: TranspilerConfig): void {
        core.registerPlugin(new DependencyResolvingPlugin(this, this.dependencyTree));
        core.registerPlugin(new TranslatorPlugin(this, this.dependencyTree));

        super.bootstrap(core, config);
    }

    create(identifier: string): Module {
        const qualifierNode = this.qualifierResolver.resolve(identifier);

        if (qualifierNode) {
            return new Module(identifier, Qualifier.fromNode(qualifierNode));
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
        const linkedModules: Container<Module> = {};

        for (const [alias, use] of uses.entries) {
            const link = this.useResolver.resolve(module, use.qualifier);

            if (!link?.qualifier) {
                throw new Error(`Can't resolve module "${use.qualifier}" as "${alias}"`);
            }

            link.qualifier.ast = use.qualifier;
            linkedModules[link.uri] = link;
        }

        return linkedModules;
    }
}
