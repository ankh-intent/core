import { TokenMatcher } from '@intent/kernel/parser/TokenMatcher';
import { Tokens } from '@intent/kernel/parser/Tokens';

import { BaseBuilder, BuilderInvokers, BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';
import { ConstraintNode } from '../ast/ConstraintNode';
import { CanNode } from '../ast/CanNode';

export interface ConstraintChildren extends BuilderInvokers<any> {
  can: BuildInvoker<CanNode>;
}

export class ConstraintBuilder extends BaseBuilder<ConstraintNode, ConstraintChildren> {
  protected build(tokens: Tokens, {not}: TokenMatcher): ConstraintNode {
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
