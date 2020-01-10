import { TypedTokenMatcherInterface } from '@intent/kernel/parser/TokenMatcher';
import { BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';

import { AlchemyBuildInvokers } from '../Alchemy';
import { ConstraintNode } from '../ast/ConstraintNode';
import { CanNode } from '../ast/CanNode';
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
