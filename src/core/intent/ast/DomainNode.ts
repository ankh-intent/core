
import { AbstractNode } from '../../tree/AbstractNode';
import { TypeDefNode } from './TypeNode';

export class DomainNode extends AbstractNode {
  public identifier: string;
  public types: {[name: string]: TypeDefNode};
}
