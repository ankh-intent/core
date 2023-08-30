import { DependencyManager, PatchedASTEvent } from '@intent/kernel';
import { IdentifiableFactory } from '@intent/consumers';
import { PluginEnvironment, PatchPlugin } from '@intent/plugins';
import { TranslationContext } from '@intent/translator';

import { ModuleNode } from '@alchemy/ast';
import { Module, DeclarationRegistry, Domain } from '@alchemy/modules';

import { AlchemyTranslator } from './translation';

export const globalRegistry = (new DeclarationRegistry())
    .registerDeclaration(Domain.stub('Number'))
    .registerDeclaration(Domain.stub('Boolean'))
    .registerDeclaration(Domain.stub('String'))
    .registerDeclaration(Domain.stub('Set'))
    .registerDeclaration(Domain.stub('Map'))
    .registerDeclaration(Domain.stub('Array'))
    .registerDeclaration(Domain.stub('Callable'))
    .registerDeclaration(Domain.stub('Maybe'))
;

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

        env.log({
            trace: module,
            debug: String(module),
        });
    }
}
