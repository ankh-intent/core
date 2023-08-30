import { IdentifiableFactory } from '@intent/consumers';
import { DependencyManager, PatchedASTEvent } from '@intent/kernel';
import { PluginEnvironment, PatchPlugin } from '@intent/plugins';

import { ModuleNode } from '@alchemy/ast';
import { Module } from '@alchemy/modules';
import { TypescriptSerializer, SerializingContext } from './serializers';

export class SerializerPlugin extends PatchPlugin<ModuleNode, Module, SerializingContext> {
    private readonly serializer: TypescriptSerializer;

    constructor(factory: IdentifiableFactory<ModuleNode, Module>, tree: DependencyManager<ModuleNode, Module>) {
        super();
        this.serializer = new TypescriptSerializer();
    }

    protected createContext(env: PluginEnvironment<PatchedASTEvent<any, any>>): SerializingContext {
        return new SerializingContext();
    }

    protected visitRoot(
        env: PluginEnvironment<PatchedASTEvent<ModuleNode, Module>>,
        root: ModuleNode,
        context: SerializingContext
    ): boolean | void {
        const source = this.serializer.visit(root, context);

        // console.log(root, module);

        env.log({
            trace: module,
            debug: String(module),
        });
    }
}
