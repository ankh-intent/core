import { TreeNode } from '@intent/ast';
import { Identifiable } from '@intent/kernel';
import { PatchedASTEvent } from '@intent/consumers';

import { Plugin, PluginPhase, PluginEnvironment } from '../Plugin';

export abstract class PatchPlugin<N extends TreeNode, T extends Identifiable<N>, C> extends Plugin<PatchedASTEvent<N, T>> {
    public constructor() {
        super(PluginPhase.Patch);
    }

    process(env: PluginEnvironment<PatchedASTEvent<N, T>>) {
        const ast = env.event.data.dependency.identifiable.ast;

        if (!ast) {
            throw new Error(`Patch plugin received PatchedASTEvent with null ast dependency!`);
        }

        return this.visitRoot(
            env,
            ast,
            this.createContext(env),
        );
    }

    protected abstract createContext(env: PluginEnvironment<PatchedASTEvent<N, T>>): C;

    protected visitRoot(_env: PluginEnvironment<PatchedASTEvent<N, T>>, root: N, context: C): boolean | void {
        return this.visit(root, context);
    }

    protected visit(node: TreeNode, context: C): boolean | void {
        if (node.children.find((child) => false === this.child(child, context))) {
            return false;
        }
    }

    protected child(node: TreeNode, context: C): boolean | void {
        return this.visit(node, context);
    }
}
