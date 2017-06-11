
import { AbstractNode } from './AbstractNode';
import { UseNode } from './UseNode';
import { DomainNode } from './DomainNode';

export class ChipNode extends AbstractNode {
  public name: string;
  public uses: {[name: string]: UseNode} = {};
  public domains: {[name: string]: DomainNode} = {};
  public can: DomainNode;
}
