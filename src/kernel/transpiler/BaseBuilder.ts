import { Strings } from '@intent/utils';
import { Region } from '@intent/source';
import { Token, BaseTokenTypes, TokenMatcher, TypedMatcher } from '@intent/parser';

import { TreeNode, TokenVisitor } from '../ast';

export interface BuildInvoker<N extends TreeNode, TT extends BaseTokenTypes = any> {
  (tokens: TokenMatcher<TT>): N;
}

export type BuilderInvokers<T, TT extends BaseTokenTypes = BaseTokenTypes> = {
  [name in keyof T]: BuildInvoker<any, TT>;
}

export abstract class BaseBuilder<
  TT extends BaseTokenTypes,
  N extends TreeNode,
  I extends BuilderInvokers<any, TT>,
> implements TokenVisitor<N> {
  protected child: I;

  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(builders: I) {
    this.child = builders;
  }

  protected get name(): string {
    return Strings.camelCaseToHyphenCase(
      this.constructor.name.replace(/Builder$/, '')
    );
  }

  public visit(tokens: TokenMatcher<TT>): N|null {
    const mark = tokens.current();

    try {
      const node: N|null = this.build(tokens, tokens.matcher);

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
    const after = this.seek(tokens, tokens.current() + 1, -1);

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

    do {
      start += delta;
      token = tokens.at(start, true);
    } while (token && (token.type === BaseTokenTypes.TK_WHITESPACE));

    return token;
  }

  protected abstract build(tokens: TokenMatcher<TT>, matcher: TypedMatcher<TT>): N|null;
}

