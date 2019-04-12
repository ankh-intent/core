
import { Tokens } from '../../../parsing/parser/Tokens';
import { BaseBuilder, BuilderInvokers, BuildInvoker } from './BaseBuilder';
import { ConstraintNode } from '../ast/ConstraintNode';
import { TokenMatcher } from '../../../parsing/parser/TokenMatcher';
import { CanNode } from '../ast/CanNode';

export interface ConstraintChildren extends BuilderInvokers<any> {
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

    return Object.assign(new ConstraintNode(), {
      can,
    });
  }
}
