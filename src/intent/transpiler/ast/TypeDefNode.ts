
import { AbstractNode } from '../../../core/consumers/ast-compiling/tree/AbstractNode';
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
