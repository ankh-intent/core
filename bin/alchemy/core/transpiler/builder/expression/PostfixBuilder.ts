import { TypedTokenMatcherInterface } from '@intent/parser';

import { PostfixNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type PostfixChildren = {
};

export class PostfixBuilder extends BaseBuilder<PostfixNode, PostfixChildren> {
  protected build(tokens, { get }: TypedTokenMatcherInterface) {
    const operation = get.symbol('--') || get.symbol('++');

    if (operation) {
      return new PostfixNode(
        operation,
      );
    }

    return null;
  }
}
