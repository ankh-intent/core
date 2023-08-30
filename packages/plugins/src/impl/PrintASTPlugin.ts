import { Identifiable, PatchedASTEvent, TreeNode } from '@intent/kernel';
import { PatchPlugin } from '../phases';
import { PluginEnvironment } from '../Plugin';

interface PrintContext {
    depth: number;
    data: string[];
}

export class PrintASTPlugin<N extends TreeNode, T extends Identifiable<N>> extends PatchPlugin<N, T, PrintContext> {
    protected createContext(): PrintContext {
        return {
            depth: -1,
            data: [],
        };
    }

    protected visitRoot(env: PluginEnvironment<PatchedASTEvent<N, T>>, root: N, context: PrintContext) {
        if (false !== super.visitRoot(env, root, context)) {
            env.log({
                warn: {
                    ast: context.data.join('\n'),
                },
            });
        }
    }

    protected visit(node: TreeNode, context: PrintContext) {
        context.data.push(`${''.padStart(context.depth * 2, ' ')}${node.node}`);

        return super.visit(node, { ...context, depth: context.depth + 1 });
    }
}
