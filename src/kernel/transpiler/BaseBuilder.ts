import { Strings, Container } from '@intent/utils';
import { Region } from '@intent/source';
import {
  Token,
  BaseTokenTypes,
  TokenMatcher,
  SyntaxError,
  TypedTokenMatcherInterface,
} from '@intent/parser';

import { TreeNode, TokenVisitor } from '../ast';

export interface BuildInvoker<N extends TreeNode, TT extends BaseTokenTypes = any> {
  (tokens: TokenMatcher<TT>): N;
}

export type BuilderInvokers<T extends Container<TreeNode>, TT extends BaseTokenTypes = BaseTokenTypes> = {
  [name in keyof T]: BuildInvoker<T[name], TT>;
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
    const index = tokens.current();
    const state = tokens.pushState();

    try {
      const node: N|null = this.build(tokens, tokens.matcher);

      if (node) {
        node.astRegion = this.narrowRegion(tokens, index);
      } else {
        tokens.goto(index);
      }

      tokens.popState(state);

      return node;
    } catch (e) {
      tokens.goto(index);

      throw this.error(tokens, this.name, `Failed @${this.name}`, e);
    }
  }

  protected lookup<T extends TreeNode>(marker: string, tokens: TokenMatcher<TT>, invoker: BuildInvoker<T>): T|null {
    const mark = { marker };

    try {
      tokens.mark(mark);

      return invoker(tokens);
    } catch (e) {
      if (tokens.has(marker) > tokens.has(mark)) {
        // relative marker found
        throw e;
      }

      return null;
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

  public error(tokens: TokenMatcher<TT>, expectation: string|TreeNode, reason: string, parent?: Error): SyntaxError {
    if (typeof expectation !== 'string') {
      return new SyntaxError(
        reason,
        expectation.node,
        tokens.source,
        tokens.source.position(expectation.astRegion.from),
        parent,
      );
    }

    return tokens.error(expectation, reason, parent);
  }

  protected abstract build(tokens: TokenMatcher<TT>, matcher: TypedTokenMatcherInterface<TT>): N|null;
}
