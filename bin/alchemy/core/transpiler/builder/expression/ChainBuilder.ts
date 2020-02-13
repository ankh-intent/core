import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { BinaryOperationNode, IdentifierNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface ChainChildren extends AlchemyBuildInvokers {
  identifier: BuildInvoker<IdentifierNode>;
}

export class ChainBuilder extends BaseBuilder<BinaryOperationNode, ChainChildren> {
  protected build(tokens, { ensure }: TypedTokenMatcherInterface) {
    ensure.symbol('.');

    return new BinaryOperationNode('[', this.child.identifier(tokens));
  }
}
