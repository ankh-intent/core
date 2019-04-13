import { Tokens } from '@intent/kernel/parser/Tokens';
import { TreeNode } from '@intent/kernel/ast/TreeNode';
import { TokenVisitor } from '@intent/kernel/ast/TokenVisitor';

export interface BuildInvoker<N extends TreeNode> {
  (tokens: Tokens): N;
}

export type BuildInvokers<T> = {
  [name in keyof T]: BuildInvoker<any>;
}

export abstract class BaseBuilder<N extends TreeNode, T extends BuildInvokers<any>> implements TokenVisitor<N> {
  protected child: T;

  constructor(builders: T) {
    this.child = builders;
  }

  public abstract visit(tokens: Tokens): N;
}

