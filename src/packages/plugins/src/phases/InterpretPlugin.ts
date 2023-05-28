import { TreeNode } from '@intent/ast';

import { PatchedASTEvent } from '../../../../consumers';
import { Identifiable } from '../../../../kernel';

import { Plugin, PluginPhase, PluginEnvironment } from '../Plugin';

export abstract class InterpretPlugin<N extends TreeNode, T extends Identifiable<N>, C> extends Plugin<PatchedASTEvent<N, T>> {
  public constructor() {
    super(PluginPhase.Patch);
  }

  process(env) {
    return this.visitRoot(
      env,
      env.event.data.dependency.identifiable.ast,
      this.createContext(env),
    );
  }

  protected abstract createContext(env: PluginEnvironment<PatchedASTEvent<N, T>>): C;

  protected visitRoot(env: PluginEnvironment<PatchedASTEvent<N, T>>, root: N, context: C): boolean | void {
    return this.visit(root, context);
  }

  protected visit(node: TreeNode, context: C): boolean | void {
    if (false === this.pre(node, context)) {
      return false;
    }

    if (node.children.find((child) => false === this.child(child, context))) {
      return false;
    }

    return this.post(node, context);
  }

  protected pre(node: TreeNode, context: C): boolean | void {
  }

  protected child(node: TreeNode, context: C): boolean | void {
    return this.visit(node, context);
  }

  protected post(node: TreeNode, context: C): boolean | void {
  }
}
