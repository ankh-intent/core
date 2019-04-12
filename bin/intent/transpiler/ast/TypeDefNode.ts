import { AbstractNode } from '@intent/kernel/ast/AbstractNode';

import { TypeNode } from './TypeNode';
import { DomainNode } from './DomainNode';

export class TypeDefNode extends AbstractNode {
  public domain: DomainNode;
  public name: string;
  public parent: TypeNode;

  public properties: {[name: string]: any};
  public constraints;
  public can;
}
