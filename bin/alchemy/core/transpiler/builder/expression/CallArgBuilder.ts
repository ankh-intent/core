import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../Alchemy';
import { ExpressionNode, CallArgNode } from '../../ast';
import { BaseBuilder } from '../BaseBuilder';

export interface CallArgChildren extends AlchemyBuildInvokers {
  expression: BuildInvoker<ExpressionNode>;
}

export class CallArgBuilder extends BaseBuilder<CallArgNode, CallArgChildren> {
  protected build(tokens, { get, peek, ensure }: TypedTokenMatcherInterface) {
    let identifier: string|null = null;

    if (peek.identifier() && peek.symbol(':', 1)) {
      identifier = get.identifier();

      ensure.symbol(':');
    }

    const expression = this.child.expression(tokens);

    return new CallArgNode(
      identifier,
      expression,
    );
  }
}
