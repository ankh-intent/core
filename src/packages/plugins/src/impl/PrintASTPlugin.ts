import { Identifiable, StatEvent } from '../../../../kernel';
import { TreeNode } from '../../../ast';
import { InterpretPlugin } from '../phases';

interface PrintContext {
  depth: number;
  data: string[];
}

export class PrintASTPlugin<N extends TreeNode, T extends Identifiable<N>> extends InterpretPlugin<N, T, PrintContext> {
  protected createContext(env): PrintContext {
    return {
      depth: -1,
      data: [],
    };
  }

  protected visitRoot(env, root: N, context: PrintContext) {
    if (false !== super.visitRoot(env, root, context)) {
      env.events.emit(new StatEvent({
        stat: {
          type: 'log',
          message: {
            ast: context.data.join('\n'),
          },
        },
        parent: env.event,
      }))
    }
  }

  protected visit(node: TreeNode, context: PrintContext) {
    return super.visit(node, { ...context, depth: context.depth + 1 });
  }

  protected pre(node: TreeNode, context: PrintContext): boolean | void {
    context.data.push(`${''.padStart(context.depth * 2, ' ')}${node.node}`);
  }
}
