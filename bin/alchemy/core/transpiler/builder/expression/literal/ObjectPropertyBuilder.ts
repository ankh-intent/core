import { TypedTokenMatcherInterface } from '@intent/parser';
import { BuildInvoker } from '@intent/kernel/transpiler';

import { AlchemyBuildInvokers } from '../../../Alchemy';
import { ObjectPropertyNode, ExpressionNode } from '../../../ast';
import { BaseBuilder } from '../../BaseBuilder';

export interface ObjectPropertyChildren extends AlchemyBuildInvokers {
  object_property: BuildInvoker<ObjectPropertyNode>;
  expression: BuildInvoker<ExpressionNode>;
}

export class ObjectPropertyBuilder extends BaseBuilder<ObjectPropertyNode, ObjectPropertyChildren> {
  protected build(tokens, { get, peek, ensure }: TypedTokenMatcherInterface) {
    const identifier = ensure.identifier();
    ensure.symbol(':');
    const expression = this.child.expression(tokens);

    return new ObjectPropertyNode(
      identifier,
      expression,
    );
  }
}
