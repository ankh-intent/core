import { TypedTokenMatcherInterface } from '@intent/kernel/parser/TokenMatcher';
import { BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';

import { AlchemyBuildInvokers } from '../Alchemy';
import { QualifierNode } from '../ast/QualifierNode';
import { BaseBuilder } from './BaseBuilder';

export interface QualifierChildren extends AlchemyBuildInvokers {
  qualifier: BuildInvoker<QualifierNode>;
}

export class QualifierBuilder extends BaseBuilder<QualifierNode, QualifierChildren> {
  protected build(tokens, { get, ensure }: TypedTokenMatcherInterface) {
    const value = ensure.identifier();

    return new QualifierNode(
      value,
      get.symbol('.') ? this.child.qualifier(tokens) : null,
    );
  }
}
