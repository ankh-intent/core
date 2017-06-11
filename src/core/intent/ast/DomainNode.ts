
import { AbstractNode } from '../../tree/AbstractNode';
import { TypeDefNode } from './TypeNode';
import { UseNode } from './UseNode';

export class DomainNode extends AbstractNode {
  public identifier: string;
  public types: {[name: string]: TypeDefNode};
  public uses: {[name: string]: UseNode};
}
