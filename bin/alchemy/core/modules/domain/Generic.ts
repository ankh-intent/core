import { GenericTemplateNode } from '../../transpiler/ast';
import { GenericInterface, ReferenceInterface, DomainInterface } from '../interfaces';
import { Translated } from '../Translated';

export class Generic extends Translated<GenericTemplateNode> implements GenericInterface {
  identifier: string;
  domain: DomainInterface;
  defaultsTo?: ReferenceInterface;

  toString() {
    return `${this.identifier}${this.domain.parent ? `: ${this.domain.parent}` : ''}${this.defaultsTo ? ` = ${this.defaultsTo}` : ''}`;
  }
}
