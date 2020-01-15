import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../Alchemy';
import { ConstraintNode, CanNode } from '../ast';
import { BaseBuilder } from './BaseBuilder';

export interface ConstraintChildren extends AlchemyBuildInvokers {
  can: BuildInvoker<CanNode>;
}

export class ConstraintBuilder extends BaseBuilder<ConstraintNode, ConstraintChildren> {
  protected build(tokens, { not }: TypedTokenMatcherInterface) {
    if (not.symbol(':')) {
      return null;
    }

    const can = this.child.can(tokens);

    if (!can) {
      throw tokens.error('Expected method declaration after ":"');
    }

    return new ConstraintNode(
      can,
    );
  }
}
