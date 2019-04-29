import { Strings } from '../../utils/Strings';
import { Token } from '../parser/Token';
import { Region } from '../source/Region';
import { BaseTokenTypes } from '../parser/Tokenizer';
import { TokenMatcher } from '../parser/TokenMatcher';
import { TypedMatcher } from '../parser/TypedMatcher';
import { TreeNode } from '../ast/TreeNode';
import { TokenVisitor } from '../ast/TokenVisitor';

export interface BuildInvoker<N extends TreeNode, TT extends typeof BaseTokenTypes = any> {
  (tokens: TokenMatcher<TT>): N;
}

export type BuilderInvokers<T, TT extends typeof BaseTokenTypes> = {
  [name in keyof T]: BuildInvoker<any, TT>;
}

export abstract class BaseBuilder<N extends TreeNode, TT extends typeof BaseTokenTypes, T extends BuilderInvokers<any, TT>> implements TokenVisitor<N> {
  protected child: T;

  constructor(builders: T) {
    this.child = builders;
  }

  protected get name(): string {
    return Strings.camelCaseToHyphenCase(
      this.constructor.name.replace(/Builder$/, '')
    );
  }

  public visit(tokens: TokenMatcher<TT>): N {
    const mark = tokens.current();

    try {
      const node: N = this.build(tokens, tokens.matcher);

      if (node) {
        node.astRegion = this.narrowRegion(tokens, mark);
      } else {
        tokens.goto(mark);
      }

      return node;
    } catch (e) {
      tokens.goto(mark);

      throw tokens.error(`Failed @${this.name}`, e);
    }
  }

  protected narrowRegion(tokens: TokenMatcher<TT>, start: number): Region {
    const source = tokens.source;
    const before = this.seek(tokens, start, +1);
    const after = this.seek(tokens, tokens.current() - 1, -1);

    let { from, to } = source.range();

    if (before) {
      from = before.start;
    }

    if (after) {
      to = after.end;
    }

    return new Region(
      source.location(from),
      source.location(to),
    );
  }

  protected seek(tokens: TokenMatcher<TT>, start: number, delta: number): Token|undefined {
    let token;

    while ((token = tokens.at(start)) && (token.type === BaseTokenTypes.TK_WHITESPACE)) {
      start += delta;
    }

    return token;
  }

  protected abstract build(tokens: TokenMatcher<TT>, matcher: TypedMatcher<TT>): N;
}

