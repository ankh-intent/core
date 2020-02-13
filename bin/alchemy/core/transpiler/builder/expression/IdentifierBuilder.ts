import { TypedTokenMatcherInterface } from '@intent/parser';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { IdentifierNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface IdentifierChildren extends AlchemyBuildInvokers {
}

export class IdentifierBuilder extends BaseBuilder<IdentifierNode, IdentifierChildren> {
  protected build(tokens, { ensure }: TypedTokenMatcherInterface) {
    return new IdentifierNode(ensure.identifier());
  }
}
