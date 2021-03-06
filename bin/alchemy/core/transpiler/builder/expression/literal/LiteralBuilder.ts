import { TypedTokenMatcherInterface } from '@intent/parser';

import { LiteralNode, LiteralType } from '../../../ast';
import { BaseBuilder } from '../../BaseBuilder';

export type LiteralChildren = {
};

export class LiteralBuilder extends BaseBuilder<LiteralNode, LiteralChildren> {
  protected build(tokens, { get, peek }: TypedTokenMatcherInterface) {
    let value;

    if ((value = get.string())) {
      return new LiteralNode(
        value,
        LiteralType.String,
      );
    }

    if ((value = get.number())) {
      return new LiteralNode(
        value,
        LiteralType.Number,
      );
    }

    return null;
  }
}
