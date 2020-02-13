import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../../Alchemy';
import { TypeNode, ExpressionNode, InterfacePropertyNode } from '../../../ast';
import { BaseBuilder } from '../../BaseBuilder';

export interface InterfacePropertyChildren extends AlchemyBuildInvokers {
  type: BuildInvoker<TypeNode>;
  expression: BuildInvoker<ExpressionNode>;
}

export class InterfacePropertyBuilder extends BaseBuilder<InterfacePropertyNode, InterfacePropertyChildren> {
  protected build(tokens, { not, get, ensure, peek }: TypedTokenMatcherInterface) {
    const identifier = ensure.identifier();
    const type: TypeNode|null = get.symbol(':')
      ? this.child.type(tokens)
      : null;
    const expression: ExpressionNode|null = get.symbol('=')
      ? this.child.expression(tokens)
      : null;

    return new InterfacePropertyNode(
      identifier,
      expression,
      type,
    );
  }
}
