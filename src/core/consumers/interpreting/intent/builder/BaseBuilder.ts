import { Region } from '../../../reading/source/Region';
import { Tokens } from '../../../parsing/parser/Tokens';
import { ASTBuilder } from '../../../ast-compiling/ASTBuilder';

import { TreeNode } from '../../../ast-compiling/tree/TreeNode';

export abstract class BaseBuilder<N extends TreeNode, T> implements ASTBuilder<N> {
  protected child: T;

  constructor(builders: T) {
    this.child = builders;
    this.wrap();
  }

  protected wrap() {
    let original = this.build.bind(this);
    let patched = (tokens: Tokens) => {
      let before = tokens.peek({});
      let node: N = original(tokens);
      let after = tokens.peek({});

      if (node) {
        let source = tokens.source;
        let { from, to } = source.range();

        if (before) {
          from = before.start;
        }

        if (after) {
          to = after.end;
        }

        node.astRegion = new Region(
          source.location(from),
          source.location(to),
        );
      }

      return node;
    };

    this.build = patched;
  }

  public abstract build(tokens: Tokens): N;
}

