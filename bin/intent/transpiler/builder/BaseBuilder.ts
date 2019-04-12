import { TreeNode } from '~kernel/ast/TreeNode';
import { Tokens } from '~kernel/parser/Tokens';

import { ASTBuilder } from '../../../../src/core/consumers/ast-compiling/ASTBuilder';

export abstract class BaseBuilder<N extends TreeNode, T> implements ASTBuilder<N> {
  protected child: T;

  constructor(builders: T) {
    this.child = builders;
  }

  public abstract build(tokens: Tokens): N;
}

