
import { Tokens } from '../../parser/Tokens';
import { QualifierNode } from '../ast/QualifierNode';
import { BaseBuilder } from './BaseBuilder';

export interface QualifierChildren {

}

export class QualifierBuilder extends BaseBuilder<QualifierNode, QualifierChildren> {
  build(tokens: Tokens): QualifierNode {
    let { value: name } = tokens.ensure({type: 'identifier'});

    let qualifier = new QualifierNode();
    qualifier.name = name;

    if (tokens.get({value: '.', type: 'symbol'})) {
      qualifier.child = this.build(tokens);
    }

    return qualifier;
  }
}
