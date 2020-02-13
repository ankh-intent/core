import { TypedTokenMatcherInterface } from '@intent/parser';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { FunctorBodyNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface FunctorBodyChildren extends AlchemyBuildInvokers {
}

export class FunctorBodyBuilder extends BaseBuilder<FunctorBodyNode, FunctorBodyChildren> {
  protected build(tokens, { peek, not, get, except, ensure }: TypedTokenMatcherInterface) {
    ensure.symbol('{');

    const wrapBefore = ['='];
    const wrapAfter = [',', '=', ':', '?', 'return'];
    const breakBefore = ['?', ':'];
    const breakAfter = [';'];
    const body: string[] = [];
    let token;
    let prev = null;

    while ((token = except.symbol('}'))) {
      if (prev === 'identifier') {
        if (token.type === prev) {
          body.push(' ');
        }
      }

      if (wrapBefore.indexOf(token.value) >= 0) {
        body.push(' ');
      }

      if (breakBefore.indexOf(token.value) >= 0) {
        body.push('\n  ');
      }

      if ((token.type === 'identifier') && (token.value === 'emit')) {
        body.push('yield');
      } else {
        body.push(token.raw);
      }

      if (breakAfter.indexOf(token.value) >= 0) {
        body.push('\n');
      }

      if (wrapAfter.indexOf(token.value) >= 0) {
        body.push(' ');
      }

      prev = token.type;
    }

    ensure.symbol('}');

    return new FunctorBodyNode(body.join(''));
  }
}
