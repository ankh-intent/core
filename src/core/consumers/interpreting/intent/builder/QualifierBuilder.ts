
import { Tokens } from '../../../parsing/parser/Tokens';
import { QualifierNode } from '../ast/QualifierNode';
import { BaseBuilder } from './BaseBuilder';
import { TokenMatcher } from '../../parser/TokenMatcher';

export interface QualifierChildren {

}

export class QualifierBuilder extends BaseBuilder<QualifierNode, QualifierChildren> {
  protected build(tokens: Tokens, matcher: TokenMatcher): QualifierNode {
    let { value: name } = tokens.ensure({type: 'identifier'});

    let qualifier = new QualifierNode();
    qualifier.name = name;

    if (tokens.get({value: '.', type: 'symbol'})) {
      qualifier.child = this.visit(tokens);
    }

    return qualifier;
  }
}
