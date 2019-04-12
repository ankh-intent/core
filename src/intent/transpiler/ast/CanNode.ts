
import { AbstractNode } from '../../../core/kernel/tree/AbstractNode';
import { PropertyNode } from './PropertyNode';
import { TypeNode } from './TypeNode';

export class CanNode extends AbstractNode {
  public name: string;
  public args: {[name: string]: PropertyNode};
  public returns: TypeNode;
  public body: string;
}
