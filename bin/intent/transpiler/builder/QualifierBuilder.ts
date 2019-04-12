import { Tokens } from '@intent/kernel/parser/Tokens';

import { QualifierNode } from '../ast/QualifierNode';
import { BaseBuilder } from './BaseBuilder';

export interface QualifierChildren {

}

export class QualifierBuilder extends BaseBuilder<QualifierNode, QualifierChildren> {
  build(tokens: Tokens): QualifierNode {
    const { value: name } = tokens.ensure({type: 'identifier'});

    const qualifier = new QualifierNode();
    qualifier.name = name;

    if (tokens.get({value: '.', type: 'symbol'})) {
      qualifier.child = this.build(tokens);
    }

    return qualifier;
  }
}
