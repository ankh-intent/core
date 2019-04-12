
import { Tokens } from '../../../core/kernel/parser/Tokens';
import { ASTBuilder } from '../../../core/consumers/ast-compiling/ASTBuilder';

import { TreeNode } from '../../../core/kernel/ast/TreeNode';

export abstract class BaseBuilder<N extends TreeNode, T> implements ASTBuilder<N> {
  protected child: T;

  constructor(builders: T) {
    this.child = builders;
  }

  public abstract build(tokens: Tokens): N;
}

