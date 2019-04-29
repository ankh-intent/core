import { BaseBuilder, BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';

import { AlchemyBuildInvokers } from '../Alchemy';
import { QualifierNode } from '../ast/QualifierNode';

export interface QualifierChildren extends AlchemyBuildInvokers {
  qualifier: BuildInvoker<QualifierNode>;
}

export class QualifierBuilder extends BaseBuilder<QualifierNode, any, QualifierChildren> {
  protected build(tokens, { get, ensure }): QualifierNode {
    const { value } = ensure.identifier();

    return new QualifierNode(
      value,
      get.symbol('.') ? this.child.qualifier(tokens) : null,
    );
  }
}
