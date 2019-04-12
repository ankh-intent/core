import { Tokens } from '@intent/kernel/parser/Tokens';

import { BaseBuilder } from './BaseBuilder';
import { ConstraintNode } from '../ast/ConstraintNode';
import { CanBuilder } from './CanBuilder';

export interface ConstraintChildren {
  can: CanBuilder;
}

export class ConstraintBuilder extends BaseBuilder<ConstraintNode, ConstraintChildren> {
  public build(tokens: Tokens): ConstraintNode {
    if (tokens.not({type: 'symbol', value: ':'})) {
      return null;
    }

    let can = this.child.can.build(tokens);

    if (!can) {
      throw tokens.error('Expected method declaration after ":"');
    }

    let constraint = new ConstraintNode();
    constraint.can = can;

    return constraint;
  }
}
