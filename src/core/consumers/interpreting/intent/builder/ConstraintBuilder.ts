
import { Tokens } from '../../../parsing/parser/Tokens';
import { BaseBuilder, BuildInvoker } from './BaseBuilder';
import { ConstraintNode } from '../ast/ConstraintNode';
import { TokenMatcher } from '../../../parsing/parser/TokenMatcher';
import { CanNode } from '../ast/CanNode';

export interface ConstraintChildren {
  can: BuildInvoker<CanNode>;
}

export class ConstraintBuilder extends BaseBuilder<ConstraintNode, ConstraintChildren> {
  protected build(tokens: Tokens, {not}: TokenMatcher): ConstraintNode {
    if (not.symbol(':')) {
      return null;
    }

    let can = this.child.can(tokens);

    if (!can) {
      throw tokens.error('Expected method declaration after ":"');
    }

    let constraint = new ConstraintNode();
    constraint.can = can;

    return constraint;
  }
}
