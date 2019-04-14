import { Region } from '@intent/kernel/source/Region';
import { Strings } from '@intent/utils/Strings';
import { TokenMatcher } from '@intent/kernel/parser/TokenMatcher';
import { Tokens } from '@intent/kernel/parser/Tokens';
import { TreeNode } from '@intent/kernel/ast/TreeNode';
import { TokenVisitor } from '@intent/kernel/ast/TokenVisitor';

export interface BuildInvoker<N extends TreeNode> {
  (tokens: Tokens): N;
}

export type BuilderInvokers<T> = {
  [name in keyof T]: BuildInvoker<any>;
}

export abstract class BaseBuilder<N extends TreeNode, T extends BuilderInvokers<any>> implements TokenVisitor<N> {
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
    const mark = tokens.push();

    try {
      const node: N = this.build(tokens, tokens.matcher);

      if (node) {
        const source = tokens.source;
        const before = tokens.at(mark);
        const after = tokens.peek({});
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

