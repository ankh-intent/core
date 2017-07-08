import { Region } from '../../../reading/source/Region';
import { Tokens } from '../../../parsing/parser/Tokens';
import { TokensVisitor } from '../../../ast-compiling/ASTBuilder';
import { TokenMatcher } from '../../../parsing/parser/TokenMatcher';
import { TreeNode } from '../../../ast-compiling/tree/TreeNode';

export abstract class BaseBuilder<N extends TreeNode, T> implements TokensVisitor<N> {
  protected child: T;

  constructor(builders: T) {
    this.child = builders;
  }

  public visit(tokens: Tokens): N {
    let before = tokens.peek({});
    let node: N = this.build(tokens, tokens.matcher);

    if (!node) {
      return node;
    }

    let after = tokens.peek({});
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

    return node;
  }

  protected abstract build(tokens: Tokens, matcher: TokenMatcher): N;
}

