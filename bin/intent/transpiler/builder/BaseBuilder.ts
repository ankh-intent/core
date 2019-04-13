import { Tokens } from '@intent/kernel/parser/Tokens';
import { TreeNode } from '@intent/kernel/ast/TreeNode';
import { ASTBuilder } from '@intent/kernel/ast/ASTBuilder';

export abstract class BaseBuilder<N extends TreeNode, T> implements ASTBuilder<N> {
  protected child: T;

  constructor(builders: T) {
    this.child = builders;
  }

  public abstract build(tokens: Tokens): N;
}

