
import { AbstractNode } from '../../../core/kernel/tree/AbstractNode';
import { TypeNode } from './TypeNode';

export class PropertyNode extends AbstractNode {
  public name: string;
  public type: TypeNode;
}
