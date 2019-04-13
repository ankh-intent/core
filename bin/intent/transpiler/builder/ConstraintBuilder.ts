import { Tokens } from '@intent/kernel/parser/Tokens';

import { BaseBuilder } from './BaseBuilder';
import { ConstraintNode } from '../ast/ConstraintNode';
import { CanBuilder } from './CanBuilder';

export interface ConstraintChildren {
  can: CanBuilder;
}

export class ConstraintBuilder extends BaseBuilder<ConstraintNode, ConstraintChildren> {
  public visit(tokens: Tokens): ConstraintNode {
    if (tokens.not({type: 'symbol', value: ':'})) {
      return null;
    }

    const can = this.child.can.visit(tokens);

    if (!can) {
      throw tokens.error('Expected method declaration after ":"');
    }

    return Object.assign(new ConstraintNode(), {
      can,
    });
  }
}
