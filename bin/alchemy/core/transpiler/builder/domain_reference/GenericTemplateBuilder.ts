import { TypedTokenMatcherInterface } from '@intent/parser';

import { TypeNode, GenericTemplateNode, IdentifierNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type GenericTemplateChildren = {
  identifier: IdentifierNode;
  type: TypeNode;
};

export class GenericTemplateBuilder extends BaseBuilder<GenericTemplateNode, GenericTemplateChildren> {
  protected build(tokens, { get, peek, ensure }: TypedTokenMatcherInterface) {
    const identifier = this.child.identifier(tokens);
    const parent = get.symbol(':') ? this.child.type(tokens) : null;
    const def = get.symbol('=') ? this.child.type(tokens) : null;

    return new GenericTemplateNode(
      identifier,
      parent,
      def,
    );
  }
}
