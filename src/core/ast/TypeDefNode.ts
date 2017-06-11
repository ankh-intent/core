
import { AbstractNode } from './AbstractNode';
import { TypeNode } from './TypeNode';

export class TypeDefNode extends AbstractNode {
  public name: string;
  public parent: TypeNode;

  public properties: {[name: string]: any};
  public constraints;
  public can;
}
