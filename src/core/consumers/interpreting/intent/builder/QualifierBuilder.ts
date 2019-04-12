
import { Tokens } from '../../../parsing/parser/Tokens';
import { QualifierNode } from '../ast/QualifierNode';
import { BaseBuilder, BuilderInvokers, BuildInvoker } from './BaseBuilder';
import { TokenMatcher } from '../../../parsing/parser/TokenMatcher';

export interface QualifierChildren extends BuilderInvokers<any> {
  qualifier: BuildInvoker<QualifierNode>;
}

export class QualifierBuilder extends BaseBuilder<QualifierNode, QualifierChildren> {
  protected build(tokens: Tokens, {get, ensure}: TokenMatcher): QualifierNode {
    let { value: name } = ensure.identifier();

    let qualifier = new QualifierNode();
    qualifier.name = name;

    if (get.symbol('.')) {
      qualifier.child = this.child.qualifier(tokens);
    }

    return qualifier;
  }
}
