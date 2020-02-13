import { TypedTokenMatcherInterface } from '@intent/parser';

import { IsDomainNode, TypeNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export type IsDomainChildren = {
  type: TypeNode;
};

export class IsDomainBuilder extends BaseBuilder<IsDomainNode, IsDomainChildren> {
  protected build(tokens, { ensure }: TypedTokenMatcherInterface) {
    ensure.identifier('is');

    return new IsDomainNode(this.child.type(tokens));
  }
}
