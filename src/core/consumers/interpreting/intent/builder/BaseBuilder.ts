
import { Tokens } from '../../../parsing/parser/Tokens';
import { ASTBuilder } from '../../../ast-compiling/ASTBuilder';

import { TreeNode } from '../../../ast-compiling/tree/TreeNode';

export abstract class BaseBuilder<N extends TreeNode, T> implements ASTBuilder<N> {
  protected child: T;

  constructor(builders: T) {
    this.child = builders;
  }

  public abstract build(tokens: Tokens): N;
}

