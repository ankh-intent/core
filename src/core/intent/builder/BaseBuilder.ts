
import { Tokens } from '../../parser/Tokens';
import { ASTBuilder } from '../../ASTBuilder';

import { TreeNode } from '../../tree/TreeNode';

export abstract class BaseBuilder<N extends TreeNode, T> implements ASTBuilder<N> {
  protected child: T;

  constructor(builders: T) {
    this.child = builders;
  }

  public abstract build(tokens: Tokens): N;
}

