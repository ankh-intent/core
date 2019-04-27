import { TokenMatcher } from '@intent/kernel/parser/TokenMatcher';
import { Tokens } from '@intent/kernel/parser/Tokens';

import { QualifierNode } from '../ast/QualifierNode';
import { BaseBuilder, BuilderInvokers, BuildInvoker } from '@intent/kernel/transpiler/BaseBuilder';

export interface QualifierChildren extends BuilderInvokers<any> {
  qualifier: BuildInvoker<QualifierNode>;
}

export class QualifierBuilder extends BaseBuilder<QualifierNode, QualifierChildren> {
  protected build(tokens: Tokens, {get, ensure}: TokenMatcher): QualifierNode {
    const { value } = ensure.identifier();

    return new QualifierNode(
      value,
      get.symbol('.') ? this.child.qualifier(tokens) : null,
    );
  }
}
