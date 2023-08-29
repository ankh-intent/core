import { PatchedASTEvent, IdentifiableFactory } from '@intent/consumers';
import { DependencyManager } from '@intent/kernel';
import { PluginEnvironment, PatchPlugin } from '@intent/plugins';
import { TranslationContext } from '@intent/translator';

import { ModuleNode } from '@alchemy/ast';
import { Module, DeclarationRegistry, Domain, Qualifier } from '@alchemy/modules';

import { AlchemyTranslator } from './translation';

export const globalRegistry = (new DeclarationRegistry())
    .registerDeclaration(Domain.create((domain) => ({
        qualifier: Qualifier.create(domain, {
            name: 'Number',
        }),
    })))
    .registerDeclaration(Domain.create((domain) => ({
        qualifier: Qualifier.create(domain, {
            name: 'Boolean',
        }),
    })))
    .registerDeclaration(Domain.create((domain) => ({
        qualifier: Qualifier.create(domain, {
            name: 'String',
        }),
    })))
    .registerDeclaration(Domain.create((domain) => ({
        qualifier: Qualifier.create(domain, {
            name: 'Set',
        }),
    })))
    .registerDeclaration(Domain.create((domain) => ({
        qualifier: Qualifier.create(domain, {
            name: 'Map',
        }),
    })))
    .registerDeclaration(Domain.create((domain) => ({
        qualifier: Qualifier.create(domain, {
            name: 'Array',
        }),
    })))
    .registerDeclaration(Domain.create((domain) => ({
        qualifier: Qualifier.create(domain, {
            name: 'Callable',
        }),
    })))
    .registerDeclaration(Domain.create((domain) => ({
        qualifier: Qualifier.create(domain, {
            name: 'Maybe',
        }),
    })));

export class TranslatorPlugin extends PatchPlugin<ModuleNode, Module, TranslationContext<any>> {
    private readonly translator: AlchemyTranslator;

    constructor(factory: IdentifiableFactory<ModuleNode, Module>, tree: DependencyManager<ModuleNode, Module>) {
        super();
        this.translator = new AlchemyTranslator(factory, tree);
    }

    protected createContext(env: PluginEnvironment<PatchedASTEvent<any, any>>): TranslationContext<any> {
        return new TranslationContext({
            parent: globalRegistry,
        });
    }

    protected visitRoot(
        env: PluginEnvironment<PatchedASTEvent<ModuleNode, Module>>,
        root: ModuleNode,
        context: TranslationContext<undefined>
    ): boolean | void {
        const module = this.translator.visit(root, context);

        // console.log(root, module);

        env.stat({
            type: 'log',
            message: {
                log: String(module),
                warn: module,
            },
        });
    }
}
