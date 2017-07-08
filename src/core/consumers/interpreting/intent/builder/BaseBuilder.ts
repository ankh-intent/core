import { Region } from '../../../reading/source/Region';
import { Tokens } from '../../../parsing/parser/Tokens';
import { TokensVisitor } from '../../../ast-compiling/ASTBuilder';
import { TokenMatcher } from '../../../parsing/parser/TokenMatcher';
import { Strings } from '../../../../../intent-utils/Strings';
import { TreeNode } from '../../../ast-compiling/tree/TreeNode';

export interface BuildInvoker<N extends TreeNode> {
  (tokens: Tokens): N;
}

export type BuilderInvokers<T> = {
  [name in keyof T]: BuildInvoker<any>;
}

export abstract class BaseBuilder<N extends TreeNode, T extends BuilderInvokers<any>> implements TokensVisitor<N> {
  protected child: T;

  constructor(builders: T) {
    this.child = builders;
  }

  protected get name(): string {
    return Strings.camelCaseToHyphenCase(
      this.constructor.name.replace(/Builder$/, '')
    );
  }

  public visit(tokens: Tokens): N {
    let mark = tokens.push();

    try {
      let node: N = this.build(tokens, tokens.matcher);

      if (node) {
        let source = tokens.source;
        let { from, to } = source.range();
        let before = tokens.at(mark);
        let after = tokens.peek({});

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
      } else {
        tokens.pop(mark);
      }

      return node;
    } catch (e) {
      tokens.pop(mark);

      throw tokens.error(`Failed @${this.name}`, e);
    }
  }

  protected abstract build(tokens: Tokens, matcher: TokenMatcher): N;
}

