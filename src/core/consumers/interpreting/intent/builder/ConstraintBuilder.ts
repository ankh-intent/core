
import { Tokens } from '../../../parsing/parser/Tokens';
import { BaseBuilder } from './BaseBuilder';
import { ConstraintNode } from '../ast/ConstraintNode';
import { CanBuilder } from './CanBuilder';
import { TokenMatcher } from '../../parser/TokenMatcher';

export interface ConstraintChildren {
  can: CanBuilder;
}

export class ConstraintBuilder extends BaseBuilder<ConstraintNode, ConstraintChildren> {
  protected build(tokens: Tokens, matcher: TokenMatcher): ConstraintNode {
    if (tokens.not({type: 'symbol', value: ':'})) {
      return null;
    }

    let can = this.child.can.visit(tokens);

    if (!can) {
      throw tokens.error('Expected method declaration after ":"');
    }

    let constraint = new ConstraintNode();
    constraint.can = can;

    return constraint;
  }
}
